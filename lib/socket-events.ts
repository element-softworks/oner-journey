/** Core handshake & error events */
export const CORE_EVENTS = {
	JOIN_ROOM: 'join_room' as const,
	JOINED_ROOM: 'joined_room' as const,
	ERROR: 'error' as const,
};
export type CoreEvent = (typeof CORE_EVENTS)[keyof typeof CORE_EVENTS];

/** Events sent from the mobile client */
export const MOBILE_EVENTS = {
	DETAILS: 'mobile_details' as const,
	TAKE_PHOTO: 'mobile_take_photo' as const,
	PHOTO_DECISION: 'mobile_photo_decision' as const,
	THANK_YOU: 'mobile_thank_you' as const,
};
export type MobileEvent = (typeof MOBILE_EVENTS)[keyof typeof MOBILE_EVENTS];

/** Events sent from the kiosk client */
export const KIOSK_EVENTS = {
	TRIGGER_CAMERA: 'kiosk_trigger_camera' as const,
	PHOTO_TAKEN: 'kiosk_photo_taken' as const,
	PHOTO_PREVIEW: 'mobile_photo_preview' as const,
	PHOTO_DECISION: 'kiosk_photo_decision' as const,
	CANCEL_PHOTO: 'kiosk_cancel_photo' as const,
	THANK_YOU: 'kiosk_thank_you' as const,
	MOBILE_JOINED: 'mobile_joined' as const,
};
export type KioskEvent = (typeof KIOSK_EVENTS)[keyof typeof KIOSK_EVENTS];

/** Identify which device connected */
export enum DEVICE_TYPE {
	MOBILE = 'mobile',
	KIOSK = 'kiosk',
}

/** Redis keys */
export const CLIENT_ROOMS_HASH = 'client_rooms';
export const SESSIONS_HASH = 'kiosk_sessions';
