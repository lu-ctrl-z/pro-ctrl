ICONFIG = {
    PATTEN_REPLACE_CURRENCY : /\B(?=(\d{3})+(?!\d))/g,
    ISTORAGE_NAMESPACE: 'CtrlStorage',
    ISTORAGE_CAT: 'CtrlCatOf_' + COM_CD,
    ISTORAGE_BCODE: 'CtrlBarOf_' + COM_CD,
    CAT_NULL: JSON.stringify([]),
    IPOPUP_SELECTOR: '.ipopupContainer',
    IPOPUP_CURRENT: {},
}