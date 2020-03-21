// Add user agent as attribute (data-user-agent) on <html> element

const doc = document.documentElement;
doc.setAttribute("data-useragent", navigator.userAgent);
