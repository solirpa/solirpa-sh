import React, { useEffect } from "react";

const Cusdis = ({ id, url, title }) => {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('comments');
    script.setAttribute(
      'src',
      // 'https://cusdis.april-zhh.cn/js/cusdis.es.js'
      '/cusdis.es.js'
    );
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    anchor.appendChild(script);
    return () => {
      anchor.innerHTML = ''
    }
  });

  return (
    <div id="comments" className="py-2 my-4 border-t">
      <div
        id="cusdis_thread"
        data-host="https://cusdis.april-zhh.cn"
        data-app-id="6e6d5bd2-2e4c-46f4-8749-065858fa4f11"
        data-page-id={id}
        data-page-url={url}
        data-page-title={title}
      ></div>
    </div>
  );
}

export default Cusdis;
