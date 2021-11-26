import { getProject } from '../state';

export function apiURL() {
  const project = getProject();

  if (!project) {
    throw Error('Define typesandverbs app by running setup()');
  }

  return project;
}
