export const ViewModes = {
    MAP: 'MAP',
    TABLE: 'TABLE',
}
export const CHANGE_VIEW_MODE_TYPE = 'CHANGE_VIEW_MODE'
export const ChangeViewModeActionCreator = (targetViewMode) => ({
    type: CHANGE_VIEW_MODE_TYPE,
    targetViewMode,
})
