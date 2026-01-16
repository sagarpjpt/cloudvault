// builds breadcrumb path from root to current folder
// folders: [{ id, name, parent_id }]
// currentFolderId: string

export const buildBreadcrumbs = (folders, currentFolderId) => {
  const map = new Map();
  folders.forEach((f) => {
    map.set(f.id, f);
  });

  const breadcrumbs = [];
  let currentId = currentFolderId;

  while (currentId) {
    const folder = map.get(currentId);
    if (!folder) break;

    breadcrumbs.unshift({
      id: folder.id,
      name: folder.name,
    });

    currentId = folder.parent_id;
  }

  // root entry
  breadcrumbs.unshift({
    id: null,
    name: "My Files",
  });

  return breadcrumbs;
};
