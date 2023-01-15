import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "./firebase-config";

const uploadImg = (
  file: any,
  uploadSuccessFn: (downloadURL: string) => void
) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      switch (snapshot.state) {
        case "paused":
          break;
        case "running":
          break;
        default:
          break;
      }
    },
    (error) => console.error(error),
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      uploadSuccessFn(downloadURL);
    }
  );
};

export default uploadImg;
