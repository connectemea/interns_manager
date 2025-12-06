import { Outlet, useNavigate } from "react-router-dom";

function Events() {
  const navigate = useNavigate();

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Events
