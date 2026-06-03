# Public Assets

All files in this folder are served from the site root (e.g. `public/foo.png` → `/foo.png`).

## Project image folders

Each portfolio project has a dedicated folder. Drop new images in the matching folder and reference them from `src/data/projects.json` using `/<folder>/<filename>`.

| Project                         | Folder                              | Referenced from `projects.json`           | Status            |
| ------------------------------- | ----------------------------------- | ----------------------------------------- | ----------------- |
| AeroVit                         | `Aerovit-images/`                   | `image`, `gallery[]`                      | Yes, has images     |
| Plant.io                        | `plant-io-images/`                  | `image` (`plant-io-banner.png`)          | Yes, has banner     |
| Safehouse                       | `safehouse-images/`                 | `image`, `gallery[]`                     | Yes, has hero + recording |
| Student Consultation System     | `student-consultation-images/`      | currently placeholder — update `image`    | Pending, needs images   |
| Walang Basagan ng Thrift        | `walang-basagan-thrift-images/`     | currently placeholder — update `image`    | Pending, needs images   |
| EMG Interface Controller        | `project-emg/`                      | `image`                                   | Yes, has image      |
| Manhwa Reader                   | `manhwa-reader-images/`             | `image` (`banner.png`)                   | Yes, has banner     |

### Suggested filenames (optional)

If you want to keep naming tidy:

```
<folder>/
  ├── hero.png        # the main card image (16:9, ~1200×675 recommended)
  ├── gallery-1.png   # optional gallery images
  ├── gallery-2.png
  └── ...
```

Then in `src/data/projects.json`:

```json
{
  "image": "/plant-io-images/hero.png",
  "gallery": [
    { "src": "/plant-io-images/gallery-1.png", "caption": "Dashboard view" },
    { "src": "/plant-io-images/demo.mp4", "caption": "Walkthrough video", "type": "video" }
  ]
}
```

Videos use `"type": "video"` (omit `type` or use `"image"` for pictures).

## Other assets

- `CERTIFICATE-PREVIEWS/` — PDF certificates rendered in the in-site preview modal. See `src/components/Certifications.tsx`.
- `YNTE_Resume.pdf` — downloadable resume (referenced from the dashboard CTA).
- `ynte_pic.jpg` — profile photo.
- `favicon.svg` — site favicon.

## Case sensitivity

GitHub Pages is case-sensitive. Folder names here use mixed case for legacy reasons (`Aerovit-images`, `CERTIFICATE-PREVIEWS`); match the exact case when referencing them from code.
