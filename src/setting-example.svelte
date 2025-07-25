<script lang="ts">
    import { onMount } from 'svelte';
    import SettingPanel from '@/libs/components/setting-panel.svelte';
    import { t } from './utils/i18n';
    import { getDefaultSettings } from './defaultSettings';
    import { pushMsg } from './api';
    import { confirm } from 'siyuan';
    export let plugin;

    // 使用动态默认设置
    let settings = { ...getDefaultSettings() };

    interface ISettingGroup {
        name: string;
        items: ISettingItem[];
        //  Type："checkbox" | "select" | "textinput" | "textarea" | "number" | "slider" | "button" | "hint" | "custom";
    }

    let groups: ISettingGroup[] = [
        {
            name: t('settings.settingsGroup.group1') || 'Tab1',
            items: [
                {
                    key: 'hint',
                    value: '',
                    type: 'hint',
                    title: t('settings.hint.title'),
                    description: t('settings.hint.description'),
                },
                {
                    key: 'textinput',
                    value: settings.textinput,
                    type: 'textinput',
                    title: t('settings.textinput.title'),
                    description: t('settings.textinput.description'),
                },
                {
                    key: 'slider',
                    value: settings.slider,
                    type: 'slider',
                    title: t('settings.slider.title'),
                    description: t('settings.slider.description'),
                    slider: {
                        min: 0,
                        max: 1,
                        step: 0.1,
                    },
                },
            ],
        },
        {
            name: t('settings.settingsGroup.group2') || 'Tab2',
            items: [
                {
                    key: 'checkbox',
                    value: settings.checkbox,
                    type: 'checkbox',
                    title: t('settings.checkbox.title'),
                    description: t('settings.checkbox.description'),
                },
                // 'textarea'
                {
                    key: 'textarea',
                    value: settings.textarea,
                    type: 'textarea',
                    title: t('settings.textarea.title'),
                    description: t('settings.textarea.description'),
                    direction: 'row',
                    rows: 6,
                    placeholder: t('settings.textarea.placeholder'),
                },
                {
                    key: 'select',
                    value: settings.select,
                    type: 'select',
                    title: t('settings.select.title'),
                    description: t('settings.select.description'),
                    options: {
                        option1: t('settings.select.options.option1'),
                        option2: t('settings.select.options.option2'),
                        option3: t('settings.select.options.option3'),
                    },
                },
            ],
        },
        {
            name: t('settings.settingsGroup.reset') || 'Reset Settings',
            items: [
                {
                    key: 'reset',
                    value: '',
                    type: 'button',
                    title: t('settings.reset.title') || 'Reset Settings',
                    description:
                        t('settings.reset.description') || 'Reset all settings to default values',
                    button: {
                        label: t('settings.reset.label') || 'Reset',
                        callback: async () => {
                            confirm(
                                t('settings.reset.title') || 'Reset Settings',
                                t('settings.reset.confirmMessage') ||
                                    'Are you sure you want to reset all settings to default values? This action cannot be undone.',
                                async () => {
                                    // 确认回调
                                    settings = { ...getDefaultSettings() };
                                    updateGroupItems();
                                    await saveSettings();
                                    await pushMsg(t('settings.reset.message'));
                                },
                                () => {
                                    // 取消回调（可选）
                                    console.log('Reset cancelled');
                                }
                            );
                        },
                    },
                },
            ],
        },
    ];

    let focusGroup = groups[0].name;

    interface ChangeEvent {
        group: string;
        key: string;
        value: any;
    }

    const onChanged = ({ detail }: CustomEvent<ChangeEvent>) => {
        console.log(detail.key, detail.value);
        const setting = settings[detail.key];
        if (setting !== undefined) {
            settings[detail.key] = detail.value;
            saveSettings();
        }
    };

    async function saveSettings() {
        await plugin.saveSettings(settings);
    }

    onMount(async () => {
        await runload();
    });

    async function runload() {
        const loadedSettings = await plugin.loadSettings();
        settings = { ...loadedSettings };
        updateGroupItems();
        // 确保设置已保存（可能包含新的默认值）
        await saveSettings();
        console.debug('加载配置文件完成');
    }

    function updateGroupItems() {
        groups = groups.map(group => ({
            ...group,
            items: group.items.map(item => ({
                ...item,
                value: settings[item.key] ?? item.value,
            })),
        }));
    }

    $: currentGroup = groups.find(group => group.name === focusGroup);
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
        {#each groups as group}
            <li
                data-name="editor"
                class:b3-list-item--focus={group.name === focusGroup}
                class="b3-list-item"
                on:click={() => {
                    focusGroup = group.name;
                }}
                on:keydown={() => {}}
            >
                <span class="b3-list-item__text">{group.name}</span>
            </li>
        {/each}
    </ul>
    <div class="config__tab-wrap">
        <SettingPanel
            group={currentGroup?.name || ''}
            settingItems={currentGroup?.items || []}
            display={true}
            on:changed={onChanged}
        />
    </div>
</div>

<style lang="scss">
    .config__panel {
        height: 100%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
    }
    .config__panel > .b3-tab-bar {
        width: 170px;
    }

    .config__tab-wrap {
        flex: 1;
        height: 100%;
        overflow: auto;
        padding: 2px;
    }
</style>
