
export function printInit(images) {
	var iframe = document.createElement('IFRAME')
	iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
	iframe.setAttribute('id', 'document_list')
	document.body.appendChild(iframe)
	var doc = iframe.contentWindow.document
	return new Promise((resolve, reject) => {
		doc.write(
			`<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="Content-Style-Type" content="text/css"></head>`
		)
		doc.write('<body>')
		for (var i = 0; i < images.length; i++) {
			doc.write('<body><img src="' + images[i] + '" style="width: 210mm;height: 297mm;"/></body></html>')
		};
		doc.write('</body></html>')
		doc.close()
		resolve(true)
	})
}

export function print() {
	var iframe = document.getElementById("document_list")
	iframe.contentWindow.focus()
	iframe.contentWindow.print()
	setTimeout(() => {
		iframe.parentNode.removeChild(iframe)
	}, 2000);
}
