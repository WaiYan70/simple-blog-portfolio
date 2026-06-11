import "server-only";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createAt: Date;
  expireAt: Date;
}

interface SessionRow {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createAt: string;
  expireAt: string;
}

interface SessionMetaData {
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface CreateSessionResult {
  session: Session;
  replacedExistingSession: boolean;
}
