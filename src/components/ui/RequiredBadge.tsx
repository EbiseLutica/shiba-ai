import { Component } from 'solid-js';

const RequiredBadge: Component = () => {
  return (
    <span class="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      必須
    </span>
  );
};

export default RequiredBadge;
