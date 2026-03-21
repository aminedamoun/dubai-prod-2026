const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cheerio = require('cheerio');

const app = express();
const PORT = 3333;
const ROOT = path.join(__dirname, '..');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(ROOT, 'assets')));
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(ROOT, 'assets', 'images')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, name + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// List all HTML pages
app.get('/api/pages', (req, res) => {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.startsWith('admin'));
  res.json(files.map(f => ({ file: f, name: f.replace('.html', '').replace(/-/g, ' ') })));
});

// Parse a page into editable sections
app.get('/api/page/:file', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });

  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const sections = [];
  let sectionIndex = 0;

  // Find all major sections (section, div with id, main structural elements)
  $('body > section, body > div > section, body > main > section, [data-section], body > div[id], body > div[style*="background"], body > div[style*="padding"]').each((i, el) => {
    const $el = $(el);
    // Skip nav, footer, preloader, cursor elements
    if ($el.is('nav') || $el.closest('nav').length) return;
    if ($el.is('footer') || $el.closest('footer').length) return;
    if ($el.attr('id') === 'preloader' || $el.attr('class')?.includes('cursor')) return;
    if ($el.attr('id') === 'nav-placeholder') return;

    const id = $el.attr('id') || $el.attr('data-section') || `section-${sectionIndex}`;

    // Extract editable content
    const editables = [];

    // Find headings
    $el.find('h1, h2, h3, h4').each((j, heading) => {
      editables.push({
        type: 'heading',
        tag: heading.tagName.toLowerCase(),
        text: $(heading).html(),
        selector: getSelector($, heading, el)
      });
    });

    // Find paragraphs
    $el.find('p').each((j, p) => {
      const text = $(p).text().trim();
      if (text.length > 10) {
        editables.push({
          type: 'paragraph',
          text: $(p).html(),
          selector: getSelector($, p, el)
        });
      }
    });

    // Find images
    $el.find('img').each((j, img) => {
      editables.push({
        type: 'image',
        src: $(img).attr('src'),
        alt: $(img).attr('alt') || '',
        selector: getSelector($, img, el)
      });
    });

    // Find videos
    $el.find('video source, video').each((j, vid) => {
      const src = $(vid).attr('src');
      if (src) {
        editables.push({
          type: 'video',
          src: src,
          selector: getSelector($, vid, el)
        });
      }
    });

    // Find links/buttons
    $el.find('a[href]').each((j, a) => {
      const text = $(a).text().trim();
      if (text.length > 0 && text.length < 100) {
        editables.push({
          type: 'link',
          text: $(a).html(),
          href: $(a).attr('href'),
          selector: getSelector($, a, el)
        });
      }
    });

    // Find background images in style
    const style = $el.attr('style') || '';
    const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      editables.push({
        type: 'background',
        src: bgMatch[1],
        selector: 'self'
      });
    }

    if (editables.length > 0 || $el.children().length > 0) {
      // Try to get a meaningful title
      const firstHeading = $el.find('h1, h2, h3').first().text().trim();
      const title = firstHeading || id.replace(/-/g, ' ').replace(/section \d+/, `Section ${sectionIndex + 1}`);

      sections.push({
        index: sectionIndex,
        id: id,
        title: title.substring(0, 60),
        tag: el.tagName.toLowerCase(),
        editables: editables,
        outerHtml: $.html(el).substring(0, 200) + '...',
        hasContent: editables.length > 0
      });
      sectionIndex++;
    }
  });

  res.json({ file: req.params.file, sections, totalSections: sections.length });
});

// Get raw section HTML for advanced editing
app.get('/api/page/:file/section/:index', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const sections = getSectionElements($);
  const idx = parseInt(req.params.index);

  if (idx >= 0 && idx < sections.length) {
    res.json({ html: $.html(sections[idx]) });
  } else {
    res.status(404).json({ error: 'Section not found' });
  }
});

// Update text/content in a section
app.post('/api/page/:file/update', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const { updates } = req.body; // Array of { selector, property, value }

  for (const update of updates) {
    try {
      if (update.property === 'html') {
        $(update.selector).html(update.value);
      } else if (update.property === 'text') {
        $(update.selector).text(update.value);
      } else if (update.property === 'src') {
        $(update.selector).attr('src', update.value);
      } else if (update.property === 'href') {
        $(update.selector).attr('href', update.value);
      } else if (update.property === 'alt') {
        $(update.selector).attr('alt', update.value);
      } else if (update.property === 'background') {
        const el = $(update.selector);
        const style = el.attr('style') || '';
        const newStyle = style.replace(/background-image:\s*url\([^)]+\)/, `background-image: url('${update.value}')`);
        el.attr('style', newStyle);
      }
    } catch(e) {
      console.log('Update error:', e.message);
    }
  }

  fs.writeFileSync(filePath, $.html());
  res.json({ success: true });
});

// Delete a section
app.post('/api/page/:file/delete-section', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const sections = getSectionElements($);
  const idx = req.body.index;

  if (idx >= 0 && idx < sections.length) {
    $(sections[idx]).remove();
    fs.writeFileSync(filePath, $.html());
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Section not found' });
  }
});

// Move section up/down
app.post('/api/page/:file/move-section', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const sections = getSectionElements($);
  const { index, direction } = req.body;

  if (direction === 'up' && index > 0) {
    $(sections[index - 1]).before($.html(sections[index]));
    $(sections[index]).remove();
  } else if (direction === 'down' && index < sections.length - 1) {
    $(sections[index + 1]).after($.html(sections[index]));
    $(sections[index]).remove();
  }

  fs.writeFileSync(filePath, $.html());
  res.json({ success: true });
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ path: 'assets/images/' + req.file.filename, filename: req.file.filename });
});

// Replace section HTML entirely
app.post('/api/page/:file/replace-section', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const sections = getSectionElements($);
  const { index, newHtml } = req.body;

  if (index >= 0 && index < sections.length) {
    $(sections[index]).replaceWith(newHtml);
    fs.writeFileSync(filePath, $.html());
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Section not found' });
  }
});

// Add new section
app.post('/api/page/:file/add-section', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const { afterIndex, sectionHtml } = req.body;
  const sections = getSectionElements($);

  if (afterIndex >= 0 && afterIndex < sections.length) {
    $(sections[afterIndex]).after(sectionHtml);
  } else {
    // Add before footer or at end of body
    const footer = $('footer').first();
    if (footer.length) {
      footer.before(sectionHtml);
    } else {
      $('body').append(sectionHtml);
    }
  }

  fs.writeFileSync(filePath, $.html());
  res.json({ success: true });
});

// Preview page
app.get('/preview/:file', (req, res) => {
  const filePath = path.join(ROOT, req.params.file);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not found');
  }
});

// List available images
app.get('/api/images', (req, res) => {
  const imgDir = path.join(ROOT, 'assets', 'images');
  const files = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
  res.json(files.map(f => ({ file: f, path: 'assets/images/' + f })));
});

// List available videos
app.get('/api/videos', (req, res) => {
  const vidDir = path.join(ROOT, 'assets', 'video');
  if (!fs.existsSync(vidDir)) return res.json([]);
  const files = fs.readdirSync(vidDir).filter(f => /\.(mp4|webm|mov)$/i.test(f));
  res.json(files.map(f => ({ file: f, path: 'assets/video/' + f })));
});

// Helper: get section elements
function getSectionElements($) {
  const sections = [];
  $('body > section, body > div > section, body > main > section, [data-section], body > div[id]').each((i, el) => {
    const $el = $(el);
    if ($el.is('nav') || $el.closest('nav').length) return;
    if ($el.is('footer') || $el.closest('footer').length) return;
    if ($el.attr('id') === 'preloader' || $el.attr('class')?.includes('cursor')) return;
    if ($el.attr('id') === 'nav-placeholder') return;
    sections.push(el);
  });
  return sections;
}

// Helper: build a unique CSS selector
function getSelector($, el, parent) {
  const parts = [];
  let current = el;
  while (current && current !== parent) {
    let tag = current.tagName?.toLowerCase();
    if (!tag) break;

    const id = $(current).attr('id');
    if (id) {
      parts.unshift('#' + id);
      break;
    }

    const cls = $(current).attr('class');
    if (cls) {
      const cleanCls = cls.split(/\s+/).filter(c => c && !c.includes(':') && c.length < 30).slice(0, 2).join('.');
      if (cleanCls) tag += '.' + cleanCls;
    }

    // Add nth-child for uniqueness
    const siblings = $(current).parent().children(current.tagName?.toLowerCase());
    if (siblings.length > 1) {
      const idx = siblings.index(current);
      tag += `:nth-child(${idx + 1})`;
    }

    parts.unshift(tag);
    current = current.parent;
  }
  return parts.join(' > ');
}

// Serve admin panel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ✨ Dubai Prod CMS Editor`);
  console.log(`  ─────────────────────────`);
  console.log(`  Editor:  http://localhost:${PORT}`);
  console.log(`  Preview: http://localhost:${PORT}/preview/index.html\n`);
});
