# Project rules

- Stack: Vue 3, Tailwind CSS 4, Vite, and Twig.
- Without build. Do not run build commands.
- Don't remove `<pre>`. Make it responsive with `max-w-full overflow-x-auto` when needed.
- For spacing between headings, supporting text, controls, and buttons, use a parent `flex`/`grid` layout with `gap`. Do not use margins to create spacing between these content elements.
- For image and media containers, prefer responsive `aspect-*` ratios with `w-full` instead of fixed `h-*`/`min-h-*` values. Use fixed heights only when the component behavior or design explicitly requires them.
- Reuse existing components, composables, utilities, icons, and design tokens before introducing new abstractions.
- Keep changes targeted and do not reformat unrelated files.
- Follow `.prettierrc.json` and `.editorconfig`: LF endings, tabs, single quotes, final newlines, and a 160-character line length.
- Vue, JavaScript, TypeScript, and GraphQL use tabs displayed at width 2. Vue and JavaScript use no semicolons or trailing commas.
- CSS, SCSS, PHP, Twig, and HTML use tabs displayed at width 4. CSS/SCSS and PHP require semicolons.
- Let the configured Prettier plugins format Twig and sort Tailwind CSS classes.
- Do not create names or identifiers that match the `financing_*` pattern. Use a clear, context-specific semantic name instead.
- When a design or task requires text but no copy is provided, add appropriate Lorem Ipsum placeholder text.
- Customize PrimeVue through CSS variables using `var(...)`.
- Use existing project variables and design tokens for colors. Use the values specified in the design for spacing, sizing, typography, radii, and other visual properties.
