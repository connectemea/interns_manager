
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import {
  Home,
  Login,
  ScoreList,
  MyScore
} from './pages';
import {
  AdminLayout,
  CoordinatorLayout
} from './layouts';
import {
  Settings,
  Events,
  EventForm,
  EventManage,
} from './pages/ProtectedRoutes';
import {
  MyTeamPage,
  Dashboard
} from './pages/ProtectedRoutes/Coordinator';
import {
  AdminDashboard,
  AdminTeams,
  AdminMembers,
  AdminMemberDetail,
  AdminMemberForm
} from './pages/ProtectedRoutes/Admin';
import { AuthProvider } from '@/context/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/scoreboard",
    element: <ScoreList />,
  },
  {
    path: "/myscore",
    element: <MyScore />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "events",
        element: <Events />,
        children: [
          {
            path: "",
            element: <EventManage />
          },
          {
            path: "new",
            element: <EventForm />
          },
          {
            path: ":id",
            element: <EventForm />
          }
        ]
      },
      {
        path: "teams",
        element: <AdminTeams />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "members",
        element: <AdminMembers />,
        children: [
          {
            path: "",
            element: <AdminMemberDetail />
          },
          {
            path: "new",
            element: <AdminMemberForm />
          },
          {
            path: ":id",
            element: <AdminMemberForm />
          }
        ]
      },
    ]
  },
  {
    path: "/captain",
    element: <CoordinatorLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/captain/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "events",
        element: <Events />,
        children: [
          {
            path: "",
            element: <EventManage />
          },
          {
            path: "new",
            element: <EventForm />
          },
          {
            path: ":id",
            element: <EventForm />
          }
        ]
      },
      {
        path: "myteams",
        element: <MyTeamPage />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);


function App() {

  return (
    <>
      <AuthProvider >
        <RouterProvider router={router} />
      </AuthProvider>
    </>

  );
}

export default App;

