// services, features, and other libraries
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, userAc, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  note: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statements);

export const user = ac.newRole({
  note: ["create", "update", "delete"],
  ...userAc.statements,
});

export const admin = ac.newRole({
  note: ["create", "update", "delete"],
  ...adminAc.statements,
});

export const demo = ac.newRole({
  note: [],
});
