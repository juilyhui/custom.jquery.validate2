// jquery validate

/**
* 表单验证函数 jQuery
* @param {String} formName 需要验证的表单 name 属性
* @param {Fun} successFun 验证成功后执行的函数
* @param {Fun} failFun 验证失败后执行的函数
*/

// 点击提交按钮后验证
// ================
// 验证失败给提示文字加上formError类名，并且data-error = true;

jQuery.extend($.fn, {
	// 和提交按钮的data-formName属性值,表单验证成功执行的函数
	getForm: function(formName, successFun, failFun) {
			var $form = $("form[name = "+formName+"]");

			// H5F.setup($form); // 如果需兼容低版本浏览器，引入H5F.js，加上改行代码

			var formRulesArry = $form.find("[data-rules]");
			var formRules = [];
			for(var i=0; i<formRulesArry.length; i++){
				formRules[i] = $(formRulesArry[i]);
				formRules[i].name = $(formRulesArry[i]).attr("data-rules");
				formRules[i].rules = "/"+$(formRulesArry[i]).attr("pattern")+"/";
			}
			// console.log("RULES ARRAY : ", formRules)
			if ($().checkRequired($form) && $().checkForm($form, formRules) && $().confirmFun($form)){
				// 表单验证成功执行的函数
				// console.log("SUCCESS!!!")
				if(successFun){
					successFun();
				}
			} else {
				// 表单验证失败执行的函数
				// console.log("VALIDATE FAIL!!!");
				if(failFun){
					failFun();
				}

			}
		// })
	},

	// 清空错误提示
	clearInfo: function($form){
		$form.find("[data-info]").attr("data-error",false).removeClass('formError');
	},

	// 验证required
	checkRequired: function($form) {
		var form = $form.get(0);
		// 验证状态 state 为true，成功
 		var state = true;
		for (var i = 0; i < form.length; i++){
			var input = form[i];
			var required = input.required;
			// console.log("$(input)[0].value",$(input)[0].value)
			if (required && $(input)[0].value == ""){
				// 含required属性 并且为空的
				$().clearInfo($form);
				$form.find("[data-info="+input.getAttribute("data-required")+"]").attr("data-error",true).addClass('formError');
				state = false;
				return state;
			} else {
				$form.find("[data-info="+input.getAttribute("data-required")+"]").attr("data-error",false).removeClass('formError');
			}
		}
		return state;
	},

	// 表单规则验证
	checkForm: function($form, formRules) {
        var state = true;
        var form = $form.get(0);
        var validObj;
        for(var i =0; i< formRules.length; i++) {
        	validObj = $(form).find("[data-rules="+formRules[i].name+"]")[0];

        	if(validObj.validity && validObj.validity.valid){
        		$form.find("[data-info="+validObj.getAttribute("data-rules")+"]").attr("data-error",false).removeClass('formError');

        	} else {
        		$form.find("[data-info="+validObj.getAttribute("data-rules")+"]").attr("data-error",true).addClass('formError');
        		state = false;
        		return state;
        	}
        }
        return state;
	},

	// 再次输入密码之类的验证
	confirmFun: function($form) {
		var state = true;
		var form = $form.get(0);
		var confirmObj = $form.find("input[data-confirm]"); // 数组
		var confirmTarget;
		// console.log("CONFIRMOBJ : ", confirmObj);
		for(var i= 0; i< confirmObj.length; i++) {
			confirmTarget = $(confirmObj[i]).attr("data-confirm").substr(8);
			if($form.find("input[data-rules = "+confirmTarget+"]")[0].value != $(confirmObj[i])[0].value){
				// 不相同
				$().clearInfo($form);
				$form.find("[data-info="+$(confirmObj[i]).attr("data-confirm")+"]").attr("data-error",true).addClass('formError');
				state = false;
				return state;
			} else {
				// 相同
				$form.find("[data-info="+$(confirmObj[i]).attr("data-confirm")+"]").attr("data-error",false).removeClass('formError');
			}
		}
		return state;
	}

})
