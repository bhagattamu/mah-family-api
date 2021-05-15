import { ProjectModuleMessages } from './project.constant';
import { UserModuleMessages } from './user.constant';

export const Messages = { ...UserModuleMessages, ...ProjectModuleMessages };
