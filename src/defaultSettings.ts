import { i18n } from "./pluginInstance";

export const getDefaultSettings = () => ({
    textinput: i18n('settings.textinput.value'),
    slider: 0.5,
    checkbox: false,
    textarea: i18n('settings.textarea.value'),
    select: 'option1',
});
