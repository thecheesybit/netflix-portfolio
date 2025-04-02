import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Constants
const FIXED_CREDIT_AMOUNT = 10; // Hardcoded re-credit amount
const DAILY_SECONDS = 86400; // 24 hours in seconds

interface CreditManagerProps {
  resourceType: string; // e.g., "video", "article", "game"
  resourceId: string; // Unique identifier for the resource
  creditCost: number; // Cost to access the resource
  onCreditUpdate?: (credits: number, timeLeft: number, lastAccessedTime: Date | null) => void; // Optional callback
}

const useCreditManager = ({ resourceType, resourceId, creditCost, onCreditUpdate }: CreditManagerProps) => {
  const [credits, setCredits] = useState(0);
  const [, setLastUpdated] = useState<Date | null>(null);
  const [lastAccessedTime, setLastAccessedTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Construct a unique key for this resource
  const resourceKey = `${resourceType}:${resourceId}`;

  // Initialize and check credits
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      const now = new Date();

      if (docSnap.exists()) {
        const data = docSnap.data();
        const lastUpdatedTimestamp = data.lastUpdated?.toDate();
        const lastAccessedTimestamp = data.lastAccessed?.[resourceKey]?.toDate();
        const timeDiff = lastUpdatedTimestamp ? (now.getTime() - lastUpdatedTimestamp.getTime()) / 1000 : 0;
        const timeSinceLastAccessed = lastAccessedTimestamp ? (now.getTime() - lastAccessedTimestamp.getTime()) / 1000 : null;

        // Check if 24 hours have passed since last update to re-credit
        if (!lastUpdatedTimestamp || timeDiff >= DAILY_SECONDS) {
          await updateDoc(userDocRef, {
            credits: FIXED_CREDIT_AMOUNT,
            lastUpdated: Timestamp.now(),
          });
          setCredits(FIXED_CREDIT_AMOUNT);
          setLastUpdated(now);
          setTimeLeft(DAILY_SECONDS);
        } else {
          setCredits(data.credits || 0); // Default to 0 if credits is undefined
          setLastUpdated(lastUpdatedTimestamp);
          setTimeLeft(timeSinceLastAccessed ? DAILY_SECONDS - timeSinceLastAccessed : timeDiff < DAILY_SECONDS ? DAILY_SECONDS - timeDiff : 0);
        }

        setLastAccessedTime(lastAccessedTimestamp);
        setUserName(user.displayName || "user");
      } else {
        // New user setup
        await setDoc(userDocRef, {
          credits: FIXED_CREDIT_AMOUNT,
          lastUpdated: Timestamp.now(),
          lastAccessed: {},
        });
        setCredits(FIXED_CREDIT_AMOUNT);
        setLastUpdated(now);
        setTimeLeft(DAILY_SECONDS);
        setUserName(user.displayName || "user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate, resourceKey]);

  // Update parent component with credit info
  useEffect(() => {
    if (!loading && onCreditUpdate) {
      onCreditUpdate(credits, timeLeft || 0, lastAccessedTime);
    }
  }, [credits, timeLeft, lastAccessedTime, loading, onCreditUpdate]);

  // Handle purchase logic
  const handlePurchase = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (user && credits >= creditCost) {
      const userDocRef = doc(db, "users", user.uid);
      setLoading(true);
      await updateDoc(userDocRef, {
        credits: credits - creditCost,
        lastUpdated: Timestamp.now(),
        [`lastAccessed.${resourceKey}`]: Timestamp.now(),
      });

      setCredits(credits - creditCost);
      setLastAccessedTime(new Date());
      setTimeLeft(DAILY_SECONDS);
      setLoading(false);
      return true; // Purchase successful
    }
    return false; // Purchase failed (insufficient credits)
  };

  // Check if user can access without purchasing
  const canAccessWithoutPurchase = (): boolean => {
    return !!lastAccessedTime && timeLeft !== null && timeLeft > 0;
  };

  return {
    credits,
    timeLeft,
    lastAccessedTime,
    loading,
    userName,
    handlePurchase,
    canAccessWithoutPurchase,
  };
};

export default useCreditManager;