module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Gen UI component (tokens-only, standard structure)',
    prompts: [
      { type: 'input', name: 'name', message: 'Component Name (PascalCase):' },
      { type: 'list', name: 'lib', message: 'Target library:', choices: ['packages/ui-core', 'packages/ui-dashboard'] }
    ],
    actions: (data) => {
      const base = `${data.lib}/src/components/{{name}}`;
      return [
        { type: 'add', path: `${base}/{{name}}.tsx`, templateFile: 'templates/component.tsx.hbs' },
        { type: 'add', path: `${base}/{{name}}.module.css`, templateFile: 'templates/styles.module.css.hbs' },
        { type: 'add', path: `${base}/{{name}}.stories.tsx`, templateFile: 'templates/stories.tsx.hbs' },
        { type: 'add', path: `${base}/{{name}}.test.tsx`, templateFile: 'templates/test.tsx.hbs' },
        { type: 'add', path: `${base}/index.ts`, templateFile: 'templates/index.ts.hbs' },
        { type: 'modify', path: `${data.lib}/src/components/index.ts`, pattern: /(\/\/ PLOP: EXPORTS ANCHOR)/, template: `export * from './{{name}}';\n$1` }
      ];
    }
  });
};
