// This file is automatically generated by Cosmos. Add it to .gitignore and
// only edit if you know what you're doing.

import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';

import * as fixture0 from './components/text-document-editor/__fixtures__/TextDocumentEditor';
import * as fixture1 from './components/navigation/__fixtures__/NavigationSheet';
import * as fixture2 from './components/navigation/__fixtures__/NavigationRail';
import * as fixture3 from './components/navigation/__fixtures__/Navigation';
import * as fixture4 from './components/generation/__fixtures__/GenerationForm';
import * as fixture5 from './components/composer/__fixtures__/Composer';

import * as decorator0 from './components/cosmos.decorator';
import * as decorator1 from './components/text-document-editor/__fixtures__/cosmos.decorator';
import * as decorator2 from './components/generation/__fixtures__/cosmos.decorator';

export const rendererConfig: RendererConfig = {
  "playgroundUrl": "http://localhost:3344",
  "rendererUrl": "http://localhost:3333/cosmos/<fixture>"
};

const fixtures = {
  'components/text-document-editor/__fixtures__/TextDocumentEditor.tsx': { module: fixture0 },
  'components/navigation/__fixtures__/NavigationSheet.tsx': { module: fixture1 },
  'components/navigation/__fixtures__/NavigationRail.tsx': { module: fixture2 },
  'components/navigation/__fixtures__/Navigation.tsx': { module: fixture3 },
  'components/generation/__fixtures__/GenerationForm.tsx': { module: fixture4 },
  'components/composer/__fixtures__/Composer.tsx': { module: fixture5 }
};

const decorators = {
  'components/cosmos.decorator.tsx': { module: decorator0 },
  'components/text-document-editor/__fixtures__/cosmos.decorator.tsx': { module: decorator1 },
  'components/generation/__fixtures__/cosmos.decorator.tsx': { module: decorator2 }
};

export const moduleWrappers: UserModuleWrappers = {
  lazy: false,
  fixtures,
  decorators
};
