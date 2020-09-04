function previewHighlight(itemType, itemId, onlyHighlight) {
	var mteStarts = document.querySelectorAll("mte-start");
	var highlightPos = null;
	for ( var i=0; i < mteStarts.length; i++) {
		_itemType = mteStarts[i].getAttribute("data-mte-type");
		_itemId = mteStarts[i].getAttribute("data-mte-id");
		isHighlight = false;
		if ( _itemType == itemType && _itemId == itemId) {
			isHighlight = true;
		}
		
		if ( onlyHighlight == false || isHighlight) {
			itemPos = itemHighlight(_itemType, _itemId, isHighlight);
			if ( _itemType == itemType && _itemId == itemId) {
				highlightpos = itemPos;
			}
		}
	}
	if ( highlightpos && screen.height < highlightpos.y ) {
		window.scrollTo(highlightpos.x, highlightpos.y - 200 );
	}
}

function itemHighlight(itemType, itemId, isHighlight) {
	console.log(itemType, itemId);
	var mteStart = document.querySelector("mte-start[data-mte-type='"+itemType+"'][data-mte-id='"+itemId+"']");
	var mteEnd = document.querySelector("mte-end[data-mte-type='"+itemType+"'][data-mte-id='"+itemId+"']");
	var mteTreeWalker = document.createTreeWalker(
	  mteStart.parentNode, // parentNode부터 조회해야 구할 수 있다.
	  NodeFilter.SHOW_ELEMENT
	);
//	mteTreeWalker.nextNode(); // parentNode는 버림
	_top = mteStart.nextElementSibling.getBoundingClientRect().top;
	_left = mteStart.nextElementSibling.getBoundingClientRect().left;
	_right = mteStart.nextElementSibling.getBoundingClientRect().right;
	_bottom = mteStart.nextElementSibling.getBoundingClientRect().bottom;
	var isItemStarted = false;
	while(mteTreeWalker.nextNode()) {
		console.log(mteTreeWalker.currentNode, mteTreeWalker.currentNode.getBoundingClientRect());
	
	 if ( mteTreeWalker.currentNode == mteStart ) { isItemStarted = true;continue;}
	 if ( mteTreeWalker.currentNode == mteEnd ) break;
	 if ( isItemStarted && mteTreeWalker.currentNode.getBoundingClientRect ) {
		_rect = mteTreeWalker.currentNode.getBoundingClientRect();
		if ( _rect.top >0 && _rect.top <= _top ) _top = _rect.top;
		if ( _rect.left > 0 && _rect.left <= _left ) _left = _rect.left;
		if ( _rect.right >= _right ) _right = _rect.right;
		if ( _rect.bottom >= _bottom ) _bottom = _rect.bottom;
	 } 
	}
	console.log(itemType, itemId, _left, _top, _right, _bottom, _right-_left, _bottom-_top);
	var itemDiv = document.createElement("div");
	itemDiv.setAttribute("id",itemType+itemId);
	if ( isHighlight) {
		itemDiv.setAttribute("class","highlightItem");
	} else {
		itemDiv.setAttribute("class","normalItem");
	}
	itemDiv.setAttribute("style", "position:absolute;top:"+_top+"px;left:"+_left+"px;width:"+(_right-_left)+"px;height:"+(_bottom-_top)+"px;");
	itemDiv.setAttribute("onmouseover", "itemOver('"+itemType+itemId+"')");
	itemDiv.setAttribute("onmouseout", "itemOut('"+itemType+itemId+"')");
	itemDiv.innerHTML="<span class='label'>"+itemType+itemId+"</span>" 
					+"<span class='editBn' onclick='itemEdit(this)'>EDIT</span>"
					+"<span class='closeBn' onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>X</span>";
	document.body.appendChild(itemDiv);
	return { x: _left, y: _top };
}

function itemOver(id) {
	document.querySelector("#"+id+" .editBn").style.display='block';
	document.querySelector("#"+id+" .closeBn").style.display='block';
}

function itemOut(id) {
	document.querySelector("#"+id+" .editBn").style.display='none';
	document.querySelector("#"+id+" .closeBn").style.display='none';
}

function itemEdit(element) {
	var itemId = element.parentNode.getAttribute("id");
	const childData = {
		action: 'edit',
		itemType : itemId.substring(0,2),
		itemId : itemId.substring(2)
	};
	if (window.parent && window.parent !== this) {
		window.scroll(0,0);	//for test
		window.parent.postMessage(childData, 'http://localhost:3000');
	} else {
		alert(itemId+" 편집창을 구현해야 합니다.");
	}
}

function moveScroll(itemId){
    var offset = $("#" + itemId).offset();
    $('html, body').animate({scrollTop : offset.top}, 400);
}