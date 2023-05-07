import {Group} from './group';

interface Inviter {
  name: string;
}

export interface Invitation {
  id: number;
  group: Group;
  inviter: Inviter;
}
