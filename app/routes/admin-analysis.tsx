import { useState } from "react";
import Button from "~/components/Button";
import PopUp from "~/components/PopUp";

export default function AdminAnanlysis() {


  const [isClosed, setIsClosed] = useState(true);
  const handleOpen = () => { setIsClosed(false)};
  const handleClose = () => { setIsClosed(true)};

  return (
    <div>

      <PopUp 
        icon={"/Exclamation.svg"} 
        secondOption={"Hủy"} 
        title={"Xóa nhé ?"} 
        desc={"Có chắc muốn xóa không ?"} 
        onOpen={handleClose}
        isClosed={isClosed}
      >
        <Button children="Xóa" />
      </PopUp>

      <Button children="Mở" onClick={handleOpen} />
    </div>
  );
}
