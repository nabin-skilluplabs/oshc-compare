import assert from "node:assert/strict";
import { describe, it } from "node:test";
import esmock from "esmock";

async function loadAdminHelpers(prisma) {
  return esmock("../../src/routes/admin/helpers.js", {
    "../../src/lib/prisma.js": { prisma },
  });
}

describe("admin helper unit functions", () => {
  it("writes audit records with admin actor metadata", async () => {
    let createInput;
    const { audit } = await loadAdminHelpers({
      auditLog: {
        create: async (input) => {
          createInput = input;
          return { id: "audit-1" };
        },
      },
    });

    await audit(
      { auth: { subject: { id: "admin-1" } } },
      "provider.update",
      "provider",
      "provider-1",
      { name: "Provider One" },
    );

    assert.deepEqual(createInput.data, {
      actorAdminUserId: "admin-1",
      actorType: "admin",
      action: "provider.update",
      entityType: "provider",
      entityId: "provider-1",
      afterData: '{"name":"Provider One"}',
    });
  });

  it("omits afterData when no audit snapshot is provided", async () => {
    let createInput;
    const { audit } = await loadAdminHelpers({
      auditLog: {
        create: async (input) => {
          createInput = input;
          return { id: "audit-1" };
        },
      },
    });

    await audit({}, "order.read", "order", "order-1");
    assert.equal(createInput.data.actorAdminUserId, undefined);
    assert.equal(createInput.data.afterData, undefined);
  });
});
