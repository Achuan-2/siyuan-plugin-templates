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

import { appendBlock, deleteBlock, setBlockAttrs, getBlockAttrs, pushMsg, pushErrMsg, sql, renderSprig, getChildBlocks, insertBlock, renameDocByID, prependBlock, updateBlock, createDocWithMd, getBlockKramdown, getBlockDOM } from "./api";
import "@/index.scss";

import SettingPanel from "./SettingPanel.svelte";
import { getDefaultSettings } from "./defaultSettings";
import { setPluginInstance, i18n } from "./pluginInstance";
import LoadingDialog from "./components/LoadingDialog.svelte";

export const SETTINGS_FILE = "settings.json";



export default class PluginSample extends Plugin {
    // 本地缓存的设置，避免每次都从文件读取
    settings: any = null;


    async onload() {
        // 插件被启用时会自动调用这个函数
        // 设置插件实例
        setPluginInstance(this);

        // 加载设置
        // 启动时强制从文件读取一次
        await this.loadSettings(true);


    }

    async onLayoutReady() {
        //布局加载完成的时候，会自动调用这个函数

    }

    onunload() {
        //当插件被禁用的时候，会自动调用这个函数
        // 需要禁用监听事件
    }


    // 使用 saveData() 存储的数据发生变更时会触发，如果不定义则默认自动禁用插件再重新启用
    // Triggered when data stored using saveData() changes. If commented out, the plugin will be automatically disabled and then re-enabled.
    // onDataChanged() {
    //     console.log("onDataChanged");
    // }
    async uninstall() {
        //当插件被卸载的时候，会自动调用这个函数
        await this.onunload();
        await this.removeData(SETTINGS_FILE);
    }

    /**
     * 打开设置对话框
     */
    // 重写 openSetting 方法
    async openSetting() {
        let dialog = new Dialog({
            title: i18n("settings.settingsPanel"),
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "800px",
            height: "700px",
            destroyCallback: () => {
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
    async loadSettings(update: boolean = false) {
        if (!update && this.settings) {
            return this.settings;
        }

        const settings = await this.loadData(SETTINGS_FILE);
        const defaultSettings = getDefaultSettings();
        this.settings = { ...defaultSettings, ...settings };
        return this.settings;
    }

    /**
     * 保存设置
     */
    async saveSettings(settings: any) {
        // 更新缓存并持久化
        this.settings = settings;
        await this.saveData(SETTINGS_FILE, settings);
    }


}
