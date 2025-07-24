import { Construct } from 'constructs';

const buildResourceName = (prefix: string, name: string): string => {
  return `${prefix}-${name}`;
};

export const resourceNameWithPrefix = (scope: Construct) => {
  const prefix = scope.node.tryGetContext('resource-prefix') || 'MyApp';
  return (name: string) => buildResourceName(prefix, name);
};

export const activatedStage = (scope: Construct) => {
  const stage = scope.node.tryGetContext('stage') || 'dev';
  return stage;
};
