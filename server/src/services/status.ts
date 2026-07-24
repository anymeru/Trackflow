import prisma from "../utils/prisma";

export const FREEZING_STATUSES = ["delayed", "customs_hold", "fees_pending"];
export const TERMINAL_STATUSES = ["delivered", "returned", "lost"];
export const MOVING_STATUSES = ["in_transit", "out_for_delivery"];
export const MESSAGING_ENABLED_STATUSES = ["delayed", "customs_hold", "fees_pending", "lost"];

export function isFreezingStatus(status: string): boolean {
  return FREEZING_STATUSES.includes(status);
}

export function isTerminalStatus(status: string): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isMovingStatus(status: string): boolean {
  return MOVING_STATUSES.includes(status);
}

export function isMessagingEnabled(status: string): boolean {
  return MESSAGING_ENABLED_STATUSES.includes(status);
}

export function getWhatsAppVisibleStatuses(): string[] {
  return ["customs_hold", "fees_pending", "lost"];
}

export function isWhatsAppVisible(status: string): boolean {
  return getWhatsAppVisibleStatuses().includes(status);
}
