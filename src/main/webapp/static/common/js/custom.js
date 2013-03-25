
$(document).ready(function() {
	
	// === uniform === //
	
	 $("input:radio,input:checkbox,input:file").uniform();
	
	 
	// === Tooltips === //
	 
	$('.tip').tooltip();	
	$('.tip-left').tooltip({ placement: 'left' });	
	$('.tip-right').tooltip({ placement: 'right' });	
	$('.tip-top').tooltip({ placement: 'top' });	
	$('.tip-bottom').tooltip({ placement: 'bottom' });	
	
	
	// === datepicker === //
 	//$('.datepicker').datepicker();
 	
 	
 	// === Reset 点击reset按钮,form里的输入框清空,并提交form执行一次查询. ===//
 	
 	$("button.reset").on('click', function(){
 		
 		$(this).closest("form").find("input[type=text],select").val("").end().submit();
 		
 	});
 	
 	
 	// === option 点击More,得到更多的搜索条件===//
 	
 	$("button.options").on('click', function(){
 		
 		//搜索框切换+清空文本.
 		
 		$("div.options").toggle(300).find("input[type=text],select").val('');
 		
 		//图标切换
 		
 		$(this).find("i").toggleClass("icon-resize-small icon-resize-full");
 		
 	});
 	
 	
 	// === 所有input:submit的控件点击后,将其设置为disabled不可用,页面弹出遮罩层===//
 	
	$("input[type=submit]").on('click', function(){
		
		//页面验证是否有资源创建. 注意#resourcesDIV 和 div.resources在每个页面必须相同 
		var $resourcesDIV = $("#resourcesDIV");
		if($resourcesDIV.length > 0){
			var $resources = $resourcesDIV.find("div.resources");
			if($resources.length == 0){
				alert("请创建资源.");
				return false;
			}
		}
		
		var $this = $(this);
		$this.closest("form").valid() && $this.button('loading').addClass("disabled").closest("body").modalmanager('loading');
	});
	
	
	//=== 复制tr.clone的table tr ===//
	
	cloneParamTable();
	
});


/**
 * checkbox 全选和取消
 */
$(document).on("click","th input:checkbox",function(){
	
	var checkedStatus = this.checked;
	
	var $checkbox = $(this).closest('table').find('tr input:checkbox');
	 
	$checkbox.each(function() {
		
		//设置checkbox状态
		
		this.checked = checkedStatus;
		
		//uniform 的选中Class的处理
		
		$checker = $(this).closest('.checker > span');
		
		if (this.checked == checkedStatus) {
			$checker.removeClass('checked');
		}
		
		if (this.checked) {
			$checker.addClass('checked');
		}
		
	}); 
	
});


/**
 * 获得当前年月份加上参数月的日期.
 * 如:
 * <pre>
 * getDatePlusMonthNum(0) 当前的时间 2013-01-28
 * getDatePlusMonthNum(3) 三月后的当前时间 2013-04-28
 * </pre>
 * @param monthNum  月期数
 * @returns {String}
 */
function getDatePlusMonthNum(monthNum) {
    var CurrentDate = new Date();
    CurrentDate.setMonth(CurrentDate.getMonth() + monthNum);
    var year = CurrentDate.getFullYear();
    var month = CurrentDate.getMonth() + 1;
    var day = CurrentDate.getDate();
    return year + "-" + (month <= 9 ? '0' + month : month) + "-" + (day <= 9 ? '0' + day : day);
}

/**
 * 比较两个时间段,返回结果字符串.
 * @param startTime
 * @param endTime
 * @returns {String}
 */
function checkTime(startTime, endTime) {

 	var currentTime = getDatePlusMonthNum(0);

 	if (startTime.length > 0 && endTime.length > 0) {

 		var startTmp = startTime.split("-");
 		var endTmp = endTime.split("-");
 		var currentTmp = currentTime.split("-");
 		var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
 		var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
 		var vd = new Date(currentTmp[0], currentTmp[1], currentTmp[2]);

 		if (sd.getTime() > ed.getTime()) {
 			return "服务开始日期不能大于结束日期";
 		}
 		if (vd.getTime() > sd.getTime()) {
 			return "服务开始日期不能小于当前日期";
 		}
 	}
 	return "";
 }

/**
 * 两个指定元素 #serviceStart , #serviceEnd 比较的结果.返回报错的结果.
 * @returns
 */
function checkTimeReset(){
	  return checkTime($("#serviceStart").val(),$("#serviceEnd").val());
}


function cloneParamTable() {
	$(document).on("click", "a.clone", function() {
		var $this = $(this);
		var $tr = $this.closest('tr.clone');
		if ($this.hasClass("disabled")) {
			if ($tr.parent().find("tr.clone").length === 1) {
				alert("至少要有一个信息");
				return false;
			}
			$tr.remove();
		} else {
			if (!$this.closest("form").valid()) {
				return false;
			}
			var $clone = $tr.clone();
			$clone.find('input[type=text]').val(''); //清空文本
			$clone.find("span,p").empty();
			$tr.after($clone);
		}
	});
}

/**
 * 修改EIP服务申请或变更EIP资源时提交form的时候.将关联类型和关联ID写入隐藏域中.
 * linkType:  1.关联实例 ; 2.关联ELB
 * PS:注意元素ID
 */
function fillLinkType() {
	var $elbSelect = $("#elbSelectDiv.show #elbSelect");
	var $computeSelect = $("#computeSelectDiv.show #computeSelect");
	var linkType, linkId;
	if ($elbSelect.val() != undefined) {
		//关联ELB
		linkType = "2";
		linkId = $elbSelect.val();
	} else {
		//关联实例
		linkType = "1";
		linkId = $computeSelect.val();
	}
	$("#linkType").val(linkType);
	$("#linkId").val(linkId);
};

















