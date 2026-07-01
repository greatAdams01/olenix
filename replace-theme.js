import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

const replacements = [
  { from: /\bbg-black\b/g, to: 'bg-stone-50' },
  { from: /\bbg-\[#0a0a0a\]\b/g, to: 'bg-white' },
  { from: /\btext-white\/90\b/g, to: 'text-stone-800' },
  { from: /\btext-white\/80\b/g, to: 'text-stone-700' },
  { from: /\btext-white\/70\b/g, to: 'text-stone-600' },
  { from: /\btext-white\/60\b/g, to: 'text-stone-500' },
  { from: /\btext-white\/50\b/g, to: 'text-stone-500' },
  { from: /\btext-white\/30\b/g, to: 'text-stone-400' },
  { from: /\btext-white\b/g, to: 'text-stone-900' },
  { from: /\btext-gold-500\b/g, to: 'text-amber-600' },
  { from: /\bbg-gold-500\b/g, to: 'bg-amber-600' },
  { from: /\bbg-gold-600\b/g, to: 'bg-amber-700' },
  { from: /\bhug:bg-gold-600\b/g, to: 'hover:bg-amber-700' }, // fix later
  { from: /\border-gold-500\b/g, to: 'border-amber-600' },
  { from: /\bborder-white\/10\b/g, to: 'border-stone-200' },
  { from: /\bborder-white\/20\b/g, to: 'border-stone-300' },
  { from: /\bbg-white\/5\b/g, to: 'bg-stone-100' },
  { from: /\bbg-white\/10\b/g, to: 'bg-stone-200' },
  { from: /\bhover:bg-white\/10\b/g, to: 'hover:bg-stone-100' },
  { from: /\bhover:bg-white\/20\b/g, to: 'hover:bg-stone-200' },
  { from: /\bring-white\/10\b/g, to: 'ring-stone-200' },
  { from: /\btext-gold-400\b/g, to: 'text-amber-500' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
