"use strict";

// n1uPusaT9nvynxKjPdoaacR4QCmBEZj9YaT
// 构造函数
var PasswordItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.cipherPassword = obj.cipherPassword;
        this.description = obj.description;
    } else {
        this.cipherPassword = "";
        this.description = "";
    }
};

PasswordItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};


// 构造函数
// ownerPassword表示拥有着的密码
// passwords表示该用户存储的密码
var BoxItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
		this.ownerPassword = obj.ownerPassword;
        this.passwords = obj.passwords;
    } else {
		this.ownerPassword = "";
        this.passwords = new Array();
    }
};

BoxItem.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};


var PasswordBox = function() {
	// 定义本地存储 key是用户的地址 value是boxItem
    LocalContractStorage.defineMapProperty(this, "boxs", {
        parse: function(text) {
            return new BoxItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
};

PasswordBox.prototype = {
	// 初始化函数
    init: function() {

    },
	
	// 注册函数
	regist: function(ownerPassword){
		
		var boxItem = this.boxs.get(Blockchain.transaction.from);
		if(boxItem){
			throw new Error("you have regist befor,please now repeat regist!!")
		}
		
		ownerPassword = ownerPassword.trim();
		if (ownerPassword === ""){
			throw new Error("empty owner password！！");
		}
		
		var boxItem = new BoxItem();
		boxItem.ownerPassword = ownerPassword;
		
		this.boxs.put(Blockchain.transaction.from,boxItem);
		
		return true;
	},

	// 保存函数
    save: function(cipherPassword, description) {
        cipherPassword = cipherPassword.trim();
        description = description.trim();
        if (cipherPassword === "" || description === "") {
            throw new Error("empty cipherPassword / description");
        }

        
        var from = Blockchain.transaction.from;
        var boxItem = this.boxs.get(from);

        if (!boxItem) {
			throw new Error("you haven't regist,please regist first!!!");
        }
		
		var passwords = boxItem.passwords;
		
		// 新建一个passwordItem对象
        var passwordItem = new PasswordItem();
        passwordItem.cipherPassword = cipherPassword;
        passwordItem.description = description;
		// 将passwordItem对象插入到临时变量中
        passwords.push(passwordItem);

        boxItem.passwords = passwords;

        this.boxs.put(from, boxItem);
		
		return true;
    },

	// 获得所有存储的密码
    get: function() {
        var from = Blockchain.transaction.from;
        return this.boxs.get(from).passwords;
    }
};

module.exports = PasswordBox;