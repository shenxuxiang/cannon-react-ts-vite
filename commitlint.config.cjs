module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'header-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [2, 'always', ['build', 'ci', 'docs', 'refactor', 'style', 'perf', 'revert', 'test', 'feat', 'fix']],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'always'],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', ['lower-case']],
    'subject-empty': [2, 'never'],
    'body-case': [2, 'always', 'lower-case'],
    'body-empty': [1, 'always'],
    'body-leading-blank': [2, 'always'],
    'footer-empty': [1, 'always'],
    'footer-leading-blank': [2, 'always'],
  }
}
