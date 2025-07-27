import { Component } from 'solid-js';
import { Button, Input, Textarea, Select } from './ui';

const UIShowcase: Component = () => {
  return (
    <div class="p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">UIコンポーネント ショーケース</h1>
      
      {/* Button variants */}
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Buttonバリアント</h2>
        <div class="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">サイズバリアント</h3>
        <div class="flex items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🔍</Button>
        </div>

        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">ローディング状態</h3>
        <div class="flex gap-4">
          <Button loading>Loading...</Button>
          <Button variant="secondary" loading>Loading...</Button>
        </div>
      </section>

      {/* Input variants */}
      <section class="space-y-4 max-w-md">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Inputバリアント</h2>
        <Input placeholder="デフォルト input" />
        <Input variant="error" placeholder="エラー状態の input" />
        <Input size="sm" placeholder="Small input" />
        <Input size="lg" placeholder="Large input" />
      </section>

      {/* Textarea variants */}
      <section class="space-y-4 max-w-md">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Textareaバリアント</h2>
        <Textarea placeholder="デフォルト textarea" rows="3" />
        <Textarea variant="error" placeholder="エラー状態の textarea" rows="2" />
        <Textarea size="sm" placeholder="Small textarea" rows="2" />
      </section>

      {/* Select variants */}
      <section class="space-y-4 max-w-md">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Selectバリアント</h2>
        <Select>
          <option>デフォルト select</option>
          <option>オプション 1</option>
          <option>オプション 2</option>
        </Select>
        <Select variant="error">
          <option>エラー状態の select</option>
          <option>オプション 1</option>
          <option>オプション 2</option>
        </Select>
        <Select size="sm">
          <option>Small select</option>
          <option>オプション 1</option>
        </Select>
      </section>
    </div>
  );
};

export default UIShowcase;
