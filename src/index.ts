import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData
} from "siyuan";

import { appendBlock, deleteBlock, setBlockAttrs, getBlockAttrs, pushMsg, pushErrMsg, sql, renderSprig, getChildBlocks, insertBlock, renameDocByID, prependBlock, updateBlock, createDocWithMd, getDoc, getBlockKramdown, getBlockDOM } from "./api";
import "@/index.scss";

import SettingPanel from "./setting-example.svelte";
import { setPluginInstance, t } from "./utils/i18n";
import LoadingDialog from "./components/LoadingDialog.svelte";
import { text } from "stream/consumers";

const STORAGE_NAME = "storage";
export const SETTINGS_FILE = "settings.json";

// 默认设置
export const DEFAULT_SETTINGS = {
    textinput: 'test',
    slider: 0.5,
    checkbox: false,
    textarea: `
“天下事有难易乎？为之，则难者亦易矣；不为，则易者亦难矣”。
出自清代彭端淑的《为学一首示子侄》。
这句话的意思是，天底下的事有困难和容易之分吗？只要肯付诸行动，困难的事也变得容易；如果不躬行实践，容易的事也会变困难。
`,

};
export default class PluginSample extends Plugin {


    async onload() {

        // 设置i18n插件实例
        setPluginInstance(this);


        //const stateData = await this.loadData(STORAGE_NAME);

    }

    async onLayoutReady() {

    }

    async onunload() {
        console.log("onunload");
    }

    uninstall() {
        console.log("uninstall");
    }


    /**
     * 打开设置对话框
     */
    // 重写 openSetting 方法
    async openSetting() {
        let dialog = new Dialog({
            title: t("settingsPanel"),
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "800px",
            height: "700px",
            destroyCallback: (options) => {
                pannel.$destroy();
            }
        });

        let pannel = new SettingPanel({
            target: dialog.element.querySelector("#SettingPanel"),
            props: {
                plugin: this
            }
        });
    }
    /**
     * 加载设置
     */
    async loadSettings() {
        const settings = await this.loadData(SETTINGS_FILE) || {};;
        return { ...DEFAULT_SETTINGS, ...settings };
    }

    /**
     * 保存设置
     */
    async saveSettings(settings: any) {
        await this.saveData(SETTINGS_FILE, settings);
    }


}
