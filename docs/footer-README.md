# Shared Footer Component

This directory contains a `footer.html` file that serves as a centralized, reusable footer component for David Stein's projects.

## Usage

### For ProControls Project Pages

The footer is included directly in each HTML page. When updating the footer, all instances should be updated using this shared file as the source of truth.

### For External Projects

Other projects can load and reuse this footer in several ways:

#### 1. **Server-Side Include (SSI)**
```html
<!--#include virtual="/path/to/footer.html" -->
```

#### 2. **JavaScript Fetch and Include**
```html
<div id="footer-container"></div>

<script>
  fetch('/path/to/footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
    });
</script>
```

#### 3. **Client-Side Template (e.g., with a build tool)**
Copy the footer.html content into your template and apply your build system's include mechanism.

## Updating the Footer

When you need to update the footer:

1. **Edit `footer.html`** with your changes (copyright year, links, etc.)
2. **Update all HTML pages** that reference this footer with the new content
3. **Notify external projects** that load this file so they can refresh their versions

## Current Footer Content

- Copyright notice (© YEAR David Stein)
- "Another David Stein Production" list with links to:
  - instructor.cc
  - procontrols.org
  - indienewyork.com
  - indieboston.com

## Files to Update

When footer.html changes, ensure these pages are updated:
- index.html
- docs/help.html
- docs/license.html
- docs/gettingStarted.html
- docs/displaysTutorial.html
- docs/slidersTutorial.html
- docs/padsTutorial.html
- docs/selectorsTutorial.html
- docs/panelsTutorial.html
- docs/menusTutorial.html
- docs/demo.html
- docs/example.html
- docs/workshop.html
