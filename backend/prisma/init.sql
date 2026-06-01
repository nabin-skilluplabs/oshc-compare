PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "fullName" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "passwordHash" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "lastLoginAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Agent" (
  "id" TEXT PRIMARY KEY,
  "agencyName" TEXT,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "commissionProfileCode" TEXT,
  "approvedAt" DATETIME,
  "suspendedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Provider" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "logoFileRef" TEXT,
  "status" TEXT NOT NULL DEFAULT 'inactive',
  "websiteUrl" TEXT,
  "disclosureUrl" TEXT,
  "productDisclosureUrl" TEXT,
  "supportMetadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY,
  "providerId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'inactive',
  "fulfilmentMode" TEXT NOT NULL DEFAULT 'manual',
  "disclosureUrl" TEXT,
  "policyDocumentUrl" TEXT,
  "keyInclusions" TEXT NOT NULL DEFAULT '[]',
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("providerId", "code")
);

CREATE TABLE IF NOT EXISTS "ProductCoverType" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "coverType" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("productId", "coverType")
);

CREATE TABLE IF NOT EXISTS "PriceTable" (
  "id" TEXT PRIMARY KEY,
  "providerId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "effectiveFrom" DATETIME NOT NULL,
  "effectiveTo" DATETIME,
  "sourceFileRef" TEXT,
  "importedByAdminUserId" TEXT,
  "validationSummary" TEXT NOT NULL DEFAULT '{}',
  "publishedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("providerId", "version")
);

CREATE TABLE IF NOT EXISTS "PriceRow" (
  "id" TEXT PRIMARY KEY,
  "priceTableId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "coverType" TEXT NOT NULL,
  "durationDaysMin" INTEGER NOT NULL,
  "durationDaysMax" INTEGER NOT NULL,
  "premiumMinorUnits" INTEGER NOT NULL,
  "feeMinorUnits" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'AUD',
  "channel" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Quote" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "agentId" TEXT,
  "channel" TEXT NOT NULL DEFAULT 'direct',
  "adults" INTEGER NOT NULL,
  "children" INTEGER NOT NULL,
  "policyStartDate" DATETIME NOT NULL,
  "policyEndDate" DATETIME NOT NULL,
  "calculatedDurationDays" INTEGER NOT NULL,
  "coverType" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "QuoteResult" (
  "id" TEXT PRIMARY KEY,
  "quoteId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "providerSnapshot" TEXT NOT NULL,
  "productSnapshot" TEXT NOT NULL,
  "coverType" TEXT NOT NULL,
  "premiumMinorUnits" INTEGER NOT NULL,
  "feeMinorUnits" INTEGER NOT NULL DEFAULT 0,
  "totalMinorUnits" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AUD',
  "disclosureSnapshot" TEXT NOT NULL DEFAULT '{}',
  "expiresAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Application" (
  "id" TEXT PRIMARY KEY,
  "quoteId" TEXT NOT NULL,
  "selectedQuoteResultId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "applicantFirstName" TEXT,
  "applicantFamilyName" TEXT,
  "applicantDateOfBirth" DATETIME,
  "applicantGender" TEXT,
  "applicantNationality" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "stateRegion" TEXT,
  "postalCode" TEXT,
  "country" TEXT,
  "visaType" TEXT,
  "courseName" TEXT,
  "institutionName" TEXT,
  "studentId" TEXT,
  "courseStartDate" DATETIME,
  "courseEndDate" DATETIME,
  "validationErrors" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ApplicationDependant" (
  "id" TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL,
  "dependantType" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "familyName" TEXT NOT NULL,
  "dateOfBirth" DATETIME NOT NULL,
  "gender" TEXT,
  "nationality" TEXT,
  "relationshipToApplicant" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ConsentDocument" (
  "id" TEXT PRIMARY KEY,
  "documentType" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("documentType", "version")
);

CREATE TABLE IF NOT EXISTS "ConsentRecord" (
  "id" TEXT PRIMARY KEY,
  "applicationId" TEXT,
  "orderId" TEXT,
  "consentDocumentId" TEXT NOT NULL,
  "acceptedByEmail" TEXT,
  "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY,
  "orderReference" TEXT NOT NULL UNIQUE,
  "applicationId" TEXT NOT NULL,
  "quoteResultId" TEXT NOT NULL,
  "agentId" TEXT,
  "channel" TEXT NOT NULL DEFAULT 'direct',
  "status" TEXT NOT NULL,
  "totalMinorUnits" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AUD',
  "customerEmail" TEXT NOT NULL,
  "customerFullName" TEXT,
  "paidAt" DATETIME,
  "fulfilledAt" DATETIME,
  "cancelledAt" DATETIME,
  "refundedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OrderStateTransition" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT NOT NULL,
  "actorAdminUserId" TEXT,
  "actorType" TEXT NOT NULL DEFAULT 'system',
  "reason" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "processor" TEXT NOT NULL,
  "processorPaymentReference" TEXT,
  "status" TEXT NOT NULL DEFAULT 'created',
  "amountMinorUnits" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AUD',
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "succeededAt" DATETIME,
  "failedAt" DATETIME
);

CREATE TABLE IF NOT EXISTS "PaymentEvent" (
  "id" TEXT PRIMARY KEY,
  "paymentId" TEXT,
  "processor" TEXT NOT NULL,
  "processorEventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "processedAt" DATETIME,
  "processingError" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("processor", "processorEventId")
);

CREATE TABLE IF NOT EXISTS "ProviderSubmission" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "submissionMode" TEXT NOT NULL DEFAULT 'manual',
  "externalReference" TEXT,
  "requestPayload" TEXT,
  "responsePayload" TEXT,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "submittedAt" DATETIME,
  "completedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Certificate" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "policyNumber" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "fileRef" TEXT,
  "fileName" TEXT,
  "fileSizeBytes" INTEGER,
  "issuedAt" DATETIME,
  "sentAt" DATETIME,
  "uploadedByAdminUserId" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EmailLog" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT,
  "recipientEmail" TEXT NOT NULL,
  "templateKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "provider" TEXT,
  "providerMessageId" TEXT,
  "subject" TEXT,
  "errorMessage" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sentAt" DATETIME,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorAdminUserId" TEXT,
  "actorAgentId" TEXT,
  "actorType" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "beforeData" TEXT,
  "afterData" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "MagicLinkToken" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "purpose" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL,
  "usedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SupportRequest" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT,
  "requestType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "customerEmail" TEXT NOT NULL,
  "subject" TEXT,
  "description" TEXT,
  "assignedAdminUserId" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" DATETIME
);

CREATE TABLE IF NOT EXISTS "CommissionRule" (
  "id" TEXT PRIMARY KEY,
  "ruleCode" TEXT NOT NULL UNIQUE,
  "providerId" TEXT,
  "productId" TEXT,
  "agentId" TEXT,
  "commissionType" TEXT NOT NULL,
  "commissionValue" REAL NOT NULL,
  "effectiveFrom" DATETIME NOT NULL,
  "effectiveTo" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CommissionLedger" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "commissionRuleId" TEXT,
  "amountMinorUnits" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AUD',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "calculatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" DATETIME,
  "reversedAt" DATETIME,
  "metadata" TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS "Quote_sessionId_idx" ON "Quote"("sessionId");
CREATE INDEX IF NOT EXISTS "Quote_agentId_idx" ON "Quote"("agentId");
CREATE INDEX IF NOT EXISTS "QuoteResult_quoteId_idx" ON "QuoteResult"("quoteId");
CREATE INDEX IF NOT EXISTS "Application_email_idx" ON "Application"("email");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
CREATE INDEX IF NOT EXISTS "Order_customerEmail_idx" ON "Order"("customerEmail");
CREATE INDEX IF NOT EXISTS "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX IF NOT EXISTS "Certificate_orderId_idx" ON "Certificate"("orderId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

