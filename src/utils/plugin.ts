import { IButtonMenu, IDomEditor } from '@wangeditor-next/editor';
import { Boot } from '@wangeditor-next/editor';
import formulaModule from '@wangeditor/plugin-formula'

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(formulaModule as any)

/**
 * 自定义下拉选择菜单类
 * 实现 IButtonMenu 接口
 */
class DictionarySelectMenu implements IButtonMenu {
	// 菜单属性
	readonly title: string;
	readonly tag: string;

	iconSvg?: string | undefined;
	hotkey?: string | undefined;
	alwaysEnable?: boolean | undefined;
	width?: number | undefined;
	getIcon?: ((editor: IDomEditor) => string) | undefined;
	getTitle?: ((editor: IDomEditor) => string) | undefined;

	constructor() {
		this.title = '识别为数据字典';
		this.tag = 'button';
		this.iconSvg = '<svg t="1747811587818" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12601" width="32" height="32"><path d="M128 192c0-70.6 57.4-128 128-128h192c247.4 0 448 200.6 448 448S695.4 960 448 960H256c-70.6 0-128-57.4-128-128V192z m320 0H256v640h192c176.8 0 320-143.2 320-320S624.8 192 448 192z" p-id="12602" fill="#2c2c2c"></path></svg>'
	}

	/**
	 * 判断菜单是否处于激活状态
	 * @param editor 编辑器实例
	 * @returns 是否激活
	 */
	isActive(): boolean {
		return false;
	}

	/**
	 * 获取当前选中内容的值
	 * @param editor 编辑器实例
	 * @returns 当前值
	 */
	getValue(editor: IDomEditor): string | boolean {
		return editor.getText();
	}

	/**
	 * 判断菜单是否需要禁用
	 * @param editor 编辑器实例
	 * @returns 是否禁用
	 */
	isDisabled(): boolean {
		return false;
	}

	/**
	 * 执行命令（对于Select菜单，这个方法通常不需要实现）
	 * @param editor 编辑器实例
	 * @param value 选中的值
	 */
	exec(editor: IDomEditor, value: string | boolean): void {
		// 对于Select菜单，这个方法通常不需要实现
		// 但可以在这里添加自定义逻辑，例如监听选择变化
		editor.emit('mark-dict-click', editor, value);
		// console.log('选择了数据字典类型:', value)
	}
}

/**
 * 自定义下拉选择菜单类
 * 实现 IButtonMenu 接口
 */
class DictionaryInsertMenu implements IButtonMenu {
	// 菜单属性
	readonly title: string;
	readonly tag: string;

	iconSvg?: string | undefined;
	hotkey?: string | undefined;
	alwaysEnable?: boolean | undefined;
	width?: number | undefined;
	getIcon?: ((editor: IDomEditor) => string) | undefined;
	getTitle?: ((editor: IDomEditor) => string) | undefined;

	constructor() {
		this.title = '插入数据字典';
		this.tag = 'button';
	}

	/**
	 * 判断菜单是否处于激活状态
	 * @param editor 编辑器实例
	 * @returns 是否激活
	 */
	isActive(): boolean {
		return false;
	}

	/**
	 * 获取当前选中内容的值
	 * @param editor 编辑器实例
	 * @returns 当前值
	 */
	getValue(editor: IDomEditor): string | boolean {
		return editor.getText();
	}

	/**
	 * 判断菜单是否需要禁用
	 * @param editor 编辑器实例
	 * @returns 是否禁用
	 */
	isDisabled(): boolean {
		return false;
	}

	/**
	 * 执行命令（对于Select菜单，这个方法通常不需要实现）
	 * @param editor 编辑器实例
	 * @param value 选中的值
	 */
	exec(editor: IDomEditor, value: string | boolean): void {
		// 对于Select菜单，这个方法通常不需要实现
		// 但可以在这里添加自定义逻辑，例如监听选择变化
		editor.emit('insert-dict-click', editor, value);
		// console.log('选择了数据字典类型:', value)
	}
}

/**
 * 选中文本后触发AI工具
 */
class AiToolsMenu implements IButtonMenu {
	readonly title: string;
	readonly tag: string;

	iconSvg?: string | undefined;
	hotkey?: string | undefined;
	alwaysEnable?: boolean | undefined;
	width?: number | undefined;
	getIcon?: ((editor: IDomEditor) => string) | undefined;
	getTitle?: ((editor: IDomEditor) => string) | undefined;

	constructor() {
		this.title = 'AI工具';
		this.tag = 'button';
		this.iconSvg = '<svg t="1775547007359" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8336" width="32" height="32"><path d="M512 112c-71.296 0-129.024 57.728-129.024 129.024v49.6l-43.936 43.936a63.968 63.968 0 0 0 0 90.496l43.936 43.904v57.632l-43.936 43.904a64 64 0 0 0 0 90.528l43.936 43.904v78.048h64.032v-51.456h129.984v51.456h64v-78.048l43.936-43.904a64 64 0 0 0 0-90.528l-43.936-43.904V468.96l43.936-43.904a63.968 63.968 0 0 0 0-90.496l-43.936-43.936v-49.6C641.024 169.728 583.296 112 512 112z m65.024 419.392l30.72 30.688-30.72 30.72h-129.984l-30.688-30.72 30.688-30.688h129.984z m0-236.8l30.72 30.72-30.72 30.72h-129.984l-30.688-30.72 30.688-30.72h129.984z m-65.024-118.56a65.024 65.024 0 0 1 65.024 65.024v12.544h-129.984v-12.544A65.024 65.024 0 0 1 512 176.032z" fill="#2C2C2C" p-id="8337"></path><path d="M177.472 812.512h669.056v64H177.472z" fill="#2C2C2C" p-id="8338"></path></svg>'
	}

	isActive(): boolean {
		return false;
	}

	getValue(editor: IDomEditor): string | boolean {
		return editor.getText();
	}

	isDisabled(): boolean {
		return false;
	}

	exec(editor: IDomEditor, value: string | boolean): void {
		editor.emit('ai-tools-click', editor, value);
	}
}

/**
 * 选中文本后快捷润色
 */
class AiPolishMenu implements IButtonMenu {
	readonly title: string;
	readonly tag: string;

	iconSvg?: string | undefined;
	hotkey?: string | undefined;
	alwaysEnable?: boolean | undefined;
	width?: number | undefined;
	getIcon?: ((editor: IDomEditor) => string) | undefined;
	getTitle?: ((editor: IDomEditor) => string) | undefined;

	constructor() {
		this.title = '润色';
		this.tag = 'button';
	}

	isActive(): boolean {
		return false;
	}

	getValue(editor: IDomEditor): string | boolean {
		return editor.getText();
	}

	isDisabled(): boolean {
		return false;
	}

	exec(editor: IDomEditor, value: string | boolean): void {
		editor.emit('ai-polish-click', editor, value);
	}
}
// 菜单配置

// 导出菜单配置，方便在其他地方引用
// export default dictionaryMenuConf

// 支持可视化编辑公式
class MyKityFormulaMenu {
	title: string;
	tag: string;
	// showModal: boolean;
	// modalWidth: number;
	iconSvg: string;
	// modalHeight: number;
	constructor() {
		this.title = "编辑公式";
		this.iconSvg = '<svg t="1749542417714" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1540"mlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M358.4 298.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666666 42.666667 42.666667 0 0 0-42.666666-42.666667h-85.333334a170.666667 170.666667 0 0 0-170.666666 170.666667v597.333333a42.666667 42.666667 0 0 0 42.666666 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667z" fill="#666666" p-id="1541"></path><path d="M145.066667 426.666667m42.666666 0l298.666667 0q42.666667 0 42.666667 42.666666l0 0q0 42.666667-42.666667 42.666667l-298.666667 0q-42.666667 0-42.666666-42.666667l0 0q0-42.666667 42.666666-42.666666Z" fill="#666666" p-id="1542"></path><path d="M865.706667 426.666667a42.666667 42.666667 0 0 0-37.12 21.333333l-85.333334 149.333333-85.333333-149.333333a42.666667 42.666667 0 0 0-37.12-21.333333 42.666667 42.666667 0 0 0-36.693333 64l110.933333 192-110.933333 192a42.666667 42.666667 0 0 0 36.693333 64 42.666667 42.666667 0 0 0 37.12-21.333334l85.333333-149.333333 85.333334 149.333333a42.666667 42.666667 0 0 0 37.12 21.333334 42.666667 42.666667 0 0 0 36.693333-64l-110.933333-192 110.933333-192a42.666667 42.666667 0 0 0-36.693333-64z" fill="#666666" p-id="1543"></path></svg>';
		this.tag = "button";
		// this.showModal = true;
		// this.modalWidth = 900;
		// this.modalHeight = 600;
	}

	// 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
	isActive() {
		return false;
	}

	// 获取菜单执行时的 value ，用不到则返回空 字符串或 false
	getValue() {
		return "";
	}

	// 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
	isDisabled() {
		return false;
	}
	// 点击菜单时触发的函数
	exec(editor: IDomEditor) {
		editor.emit('edit-formula-click', editor, 'kityformula');
	}

	// 弹出框 modal 的定位：1. 返回某一个 SlateNode； 2. 返回 null （根据当前选区自动定位）
	getModalPositionNode() {
		return null; // modal 依据选区定位
	}
}

// 支持输入手动latex公式
class latexFormula {
	title: string;
	tag: string;
	// showModal: boolean;
	// modalWidth: number;
	iconSvg: string;
	// modalHeight: number;
	constructor() {
		this.title = "latex公式";
		this.iconSvg = '<svg t="1749894069843" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5166" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M5.76 768l327.68-256L5.76 256V170.688h597.312V256H145.024l330.048 256-330.048 256h458.048v85.312H5.76V768z m618.88 85.312h110.72l85.952-103.808 85.888 103.808h110.72l-141.248-170.752L1017.792 512h-110.72l-85.76 103.616L735.552 512h-110.72l141.12 170.56-141.312 170.752z" fill="#333333" p-id="5167"></path></svg>'
		this.tag = "button";
	}

	// 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
	isActive() {
		return false;
	}

	// 获取菜单执行时的 value ，用不到则返回空 字符串或 false
	getValue() {
		return "";
	}

	// 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
	isDisabled() {
		return false;
	}
	// 点击菜单时触发的函数
	exec(editor: IDomEditor) {
		editor.emit('latex-formula-click', editor);
	}
}

// 注册菜单
Boot.registerMenu({
	key: 'markDict', // 菜单唯一标识
	factory() {
		return new DictionarySelectMenu();
	},
});

Boot.registerMenu({
	key: 'insertDict', // 菜单唯一标识
	factory() {
		return new DictionaryInsertMenu();
	},
});

Boot.registerMenu({
	key: 'aiTools', // 菜单唯一标识
	factory() {
		return new AiToolsMenu();
	},
});

Boot.registerMenu({
	key: 'aiPolish', // 菜单唯一标识
	factory() {
		return new AiPolishMenu();
	},
});

Boot.registerMenu({
	key: 'MyKityFormulaMenu', // 菜单唯一标识
	factory() {
		return new MyKityFormulaMenu();
	},
});

Boot.registerMenu({
	key: 'latexFormula', // 菜单唯一标识
	factory() {
		return new latexFormula();
	},
});
