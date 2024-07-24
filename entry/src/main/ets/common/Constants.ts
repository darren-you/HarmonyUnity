export class Constants {
    static readonly APP_KEY_TUANJIE_MAIN_WORKER = "app_key_tuanjie_main_worker";
    static readonly APP_KEY_CALLBACK_REGISTER = "app_key_callback_register";
}

// do not set PropName of AppStorage using static class member,
// otherwise compiler error "The decorator StorageProp should have a single key" will be generated
export const APP_KEY_XCOMPONENT_WIDTH = "app_key_xcomponent_width";
export const APP_KEY_XCOMPONENT_HEIGHT = "app_key_xcomponent_height";
export const APP_KEY_ORIENTATION_CHANGE = "app_key_orientation_change";