package com.sobey.cmop.mvc.web.account;

import java.util.List;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.common.collect.Lists;
import com.sobey.cmop.mvc.constant.ConstantAccount;
import com.sobey.cmop.mvc.entity.Group;
import com.sobey.cmop.mvc.entity.User;
import com.sobey.cmop.mvc.service.account.AccountManager;
import com.sobey.cmop.mvc.service.account.ShiroDbRealm.ShiroUser;

/**
 * 用户修改自己资料的Controller.
 * 
 * @author liukai
 */
@Controller
@RequestMapping(value = "/profile")
public class ProfileController {

	@Autowired
	private AccountManager accountManager;

	@RequestMapping(method = RequestMethod.GET)
	public String profileForm(Model model) {

		User user = accountManager.getCurrentUser();

		model.addAttribute("user", user);

		Group group = accountManager.findGroupByUserId(user.getId());

		// 如果用户没有权限,则默认给该用户 2.apply 申请人 的权限.

		Integer groupId = group == null ? ConstantAccount.DefaultGroups.apply.toInteger() : group.getId();

		model.addAttribute("groupId", groupId);

		return "account/profile";
	}

	@RequestMapping(method = RequestMethod.POST)
	public String profile(@ModelAttribute("user") User user,
			@RequestParam(value = "departmentId") Integer departmentId,
			@RequestParam(value = "groupId") Integer groupId, RedirectAttributes redirectAttributes) {

		System.out.println("departmentId:" + departmentId);
		System.out.println("groupId:" + groupId);

		List<Group> groupList = Lists.newArrayList();

		groupList.add(accountManager.getGroup(groupId));

		user.setGroupList(groupList);

		user.setDepartment(accountManager.getDepartment(departmentId));

		accountManager.updateUser(user);

		// 更新Shiro中当前用户的用户名.

		updateCurrentUserName(user.getName());

		redirectAttributes.addFlashAttribute("message", "修改个人信息成功");

		return "redirect:/profile/";
	}

	/**
	 * 更新Shiro中当前用户的用户名.
	 * 
	 * @param userName
	 */
	private void updateCurrentUserName(String userName) {
		ShiroUser user = (ShiroUser) SecurityUtils.getSubject().getPrincipal();
		user.name = userName;
	}

	/**
	 * Ajax请求校验email是否唯一.
	 * 
	 * @param email
	 * @return
	 */
	@RequestMapping(value = "checkEmail")
	@ResponseBody
	public String checkEmail(@RequestParam("oldEmail") String oldEmail, @RequestParam("email") String email) {
		return email.equals(oldEmail) || accountManager.findUserByEmail(email) == null ? "true" : "false";
	}
}
