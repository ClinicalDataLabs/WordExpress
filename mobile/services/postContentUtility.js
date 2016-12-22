const getShortCode = line => {
  let shortcodeObj = {
    shortcode: '',
    content: '',
    params: {}
  };

  // get shortcode from line (gets everything in between the first set of square brackets)
  shortcodeObj.shortcode = line.match(/\[([^\]]*)\]/g)[0].toString();

  // get content between the opening and closing shortcode tags
  shortcodeObj.content = line.match(/\](.*?)\[/g).toString().slice(1, -1);

  // get array of shortcode parameters
  const params = shortcodeObj.shortcode.match(/[\w-]+="[^"]*"/g);

  // turn params into key/value pairs
  params.forEach(param => {
    const arr = param.split('=');
    shortcodeObj.params[arr[0]] = arr[1].slice(1, -1);
  });

  return shortcodeObj;
};

const renderCaptionShortCode = line => {
  const shortcode = getShortCode(line);
  const {params, content} = shortcode;
  const {id, align, width} = params;
  const img = content.match(/\<(.*?)\>/g).toString();
  const caption = content.match(/\/\>.+/g).toString().substr(2);
  return `<figure id="${id}" class="${align}" style="width: ${width}px">${img}<figcaption>${caption}</figcaption></figure>`;
};

const renderGistShortCode = line => {
  const shortcode = getShortCode(line);
  const {content} = shortcode;
  return `<div class="post--shortcode" data-type="gist" data-source="${content}"></div>`;
};

const renderGistEmbed = shortcode => {
  let gistFrame = document.createElement('iframe');
  gistFrame.setAttribute('width', '100%');
  gistFrame.id = 'gist-frame';

  let container = document.createElement('div');
  container.id = 'gist--container';

  let zone = shortcode.appendChild(container);
  zone.innerHTML = '';
  zone.appendChild(gistFrame);

  // Create the iframe's document
  let gistFrameHTML = `<html><body><script type="text/javascript" src="${shortcode.dataset.source}"></script></body></html>`;

  let gistFrameDoc = gistFrame.document;

  if (gistFrame.contentDocument) {
    gistFrameDoc = gistFrame.contentDocument;
  } else if (gistFrame.contentWindow) {
    gistFrameDoc = gistFrame.contentWindow.document;
  }

  // opens the iframe document and writes the embed script, which then gets executed
  gistFrameDoc.open();
  gistFrameDoc.writeln(gistFrameHTML);
  gistFrameDoc.close();

  return gistFrameHTML;
};

const renderEmbed = shortcode => {
  switch (shortcode.dataset.type) {
    case 'gist':
      return renderGistEmbed(shortcode);
    default:
      break;
  }
};

const shortcodesHandlers = {
  caption: renderCaptionShortCode,
  gist: renderGistShortCode,
  embed: renderEmbed
};

const parseContent = content => {
  const lines = content.trim().split('\n');
  const voidTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'code', 'pre', 'img'];

  return lines.map(line => {
    // line is a shortcode
    if (line[0] === '[') {
      let shortcode = line.match(/([[])\w+/g).toString().substr(1);
      if (Object.keys(shortcodesHandlers).indexOf(shortcode) >= 0) {
        return shortcodesHandlers[shortcode](line);
      }
    } else {
      // wrap lines without voidTags in paragraph tags
      let tag = line.match(/^<\w+/g);
      tag = tag ? tag[0].slice(1) : '';
      if (voidTags.indexOf(tag) === -1 && line.length > 1) {
        return `<p>${line}</p>`;
      }
    }
    return line;
  }).join('');
};

let postContentUtility = {
  parsePostContent: parseContent
};

export default postContentUtility;
