# Abhinav Boora — personal studio

Personal website at [abhiboora.com](https://abhiboora.com), hosted on GitHub Pages.

The site uses static HTML, CSS, and vanilla JavaScript. There is no build step or package installation.

## Local preview

Run from the repository root:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080. Both `index.html` and `projects.html` work with this server.

## Files

- `index.html`: selected work, about, achievements, experience, education, and contact.
- `projects.html`: the project notebook, with stable anchors for IndyHAX, Unfolded, and Expedikiro.
- `style.css`: shared design, responsive layout, and CSS animation.
- `script.js`: navigation, project selection, achievement filters, and optional motion.
- `img/`: original portrait and gameplay screenshot.
- `favicon.svg`: the site monogram.
- `CNAME`: the existing custom domain. Keep this file when deploying to GitHub Pages.

## Interaction and accessibility

Project covers and project selectors keep the selected work in sync. Every project and credential remains readable when JavaScript is unavailable. The mobile menu supports Escape and closes after navigation. All controls use native links or buttons with visible keyboard focus.

Animations respect `prefers-reduced-motion`. Visitors can also turn motion off using the header control; the choice is stored locally, with no analytics or third-party tracking. If local storage is blocked, the choice lasts for the current page.

Google Fonts supplies Newsreader and DM Sans. System font fallbacks work when fonts cannot load. Unfolded's door illustration is clearly labeled concept artwork; the Expedikiro image is the existing gameplay screenshot.

## Editing

Project content lives in HTML; JavaScript selects the corresponding article rather than keeping a second copy of its text. To change achievements, edit the rows under `achievementsGrid` and retain `data-cat="cert"` or `data-cat="comp"` for filtering. If adding a project, update the cover, selectors, article, and `projectNames` list in `script.js`.
