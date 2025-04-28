const base = location.origin + '/monaco/min/vs';

await new Promise(resolve => {
  const script = document.createElement('script');
  script.src = base + "/loader.js";
  script.onload = resolve;
  document.head.append(script);
});

export default await new Promise(resolve => {
  require.config({ paths: { vs: base } });
  require(['vs/editor/editor.main'], resolve)
});
