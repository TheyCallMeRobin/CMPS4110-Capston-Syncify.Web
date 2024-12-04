import React, { useCallback, useContext, useEffect, useState } from 'react';
import './api/generated/config';
import './App.css';
import './syncfusion-styles.css';
import logo from './assets/Syncify.png';
import { AuthContext, useUser } from './auth/auth-context.tsx';
import { ROUTES } from './routes.tsx';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaAlignJustify,
  FaBook,
  FaCalendarAlt,
  FaEnvelope,
  FaHome,
  FaShoppingCart,
  FaTimes,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { useAsyncFn, useLocalStorage } from 'react-use';
import { AuthenticationService } from './api/generated/AuthenticationService.ts';
import { FamilyInviteService } from './api/generated/FamilyInviteService.ts';
import {
  ChangeInviteStatusDto,
  FamilyInviteGetDto,
  InviteStatus,
} from './api/generated/index.defs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCalendarFilterStore } from './calendar/calendar-filter-store.ts';

export const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [invites, setInvites] = useState<FamilyInviteGetDto[]>([]);
  const [loadingInvites, setLoadingInvites] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [isInviteMenuOpen, setIsInviteMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useUser();
  const authContext = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [{ loading: signingOut, error }, handleSignOut] =
    useAsyncFn(async () => {
      await AuthenticationService.logout();
      authContext.clearUser();
      navigate('/login');
    }, [authContext, navigate]);

  useEffect(() => {
    if (!authContext.user && authContext.loading) {
      navigate(ROUTES.LoginPage.path);
    }
  }, [authContext.loading, authContext.user, navigate]);

  const noNavBarPages = [ROUTES.LoginPage.path, ROUTES.RegisterPage.path];
  const shouldHideNavBar = noNavBarPages.includes(location.pathname);

  const fetchInvites = useCallback(async () => {
    setLoadingInvites(true);
    if (user?.id) {
      const inviteResponse = await FamilyInviteService.getInvitesByUserId({
        userId: user.id,
      });

      const invitesData = Array.isArray(inviteResponse.data)
        ? inviteResponse.data.filter(
            (invite): invite is FamilyInviteGetDto => invite !== null
          )
        : [inviteResponse.data].filter(
            (invite): invite is FamilyInviteGetDto => invite !== null
          );

      setInvites(invitesData);
    }
    setLoadingInvites(false);
  }, [user?.id]);

  const addToFilter = useCalendarFilterStore(
    (state) => state.addCalendarToFilter
  );
  const [calendarIds] = useLocalStorage<number[]>('calendar-ids');

  useEffect(() => {
    fetchInvites();
    calendarIds?.forEach((id) => addToFilter(id));
  }, [addToFilter, calendarIds, fetchInvites, user]);

  const handleInboxClick = () => {
    setIsInviteMenuOpen(!isInviteMenuOpen);
  };

  const handleInviteAction = async (
    inviteId: number,
    action: 'accept' | 'decline'
  ) => {
    setLoadingAction(inviteId);
    const status =
      action === 'accept' ? InviteStatus.Accepted : InviteStatus.Declined;
    const changeInviteStatusDto: ChangeInviteStatusDto = {
      id: inviteId,
      status,
    };

    await FamilyInviteService.changeInviteStatus({
      body: changeInviteStatusDto,
    });
    toast.success(
      `Invite successfully ${action === 'accept' ? 'accepted' : 'declined'}`
    );
    await fetchInvites();
    setLoadingAction(null);
  };

  return (
    <div className="d-flex min-vh-100">
      {!shouldHideNavBar && (
        <nav
          className={`sidebar-navbar navbar navbar-expand-lg navbar-dark flex-column vh-100 position-fixed overflow-y-auto ${
            isSidebarCollapsed ? 'collapsed' : ''
          }`}
          style={{ zIndex: '999' }}
        >
          <ul className="navbar-nav flex-column w-100 icon-list">
            <button
              className="btn btn-link nav-item text-light toggle-btn"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? (
                <FaAlignJustify size={24} />
              ) : (
                <img src={logo} alt="Syncify" className="sidebar-logo" />
              )}
            </button>
            <li className="nav-item align-text-center">
              <Link className="nav-link" to="/">
                <FaHome style={{ marginRight: '5px' }} />{' '}
                {!isSidebarCollapsed && ' Home'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendars">
                <FaCalendarAlt style={{ marginRight: '5px' }} />{' '}
                {!isSidebarCollapsed && ' Calendar'}
              </Link>
            </li>
            <li className="nav-item"></li>
            <li className="nav-item">
              <Link className="nav-link" to="/recipes">
                <FaBook style={{ marginRight: '5px' }} />{' '}
                {!isSidebarCollapsed && ' Recipes'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shopping-lists">
                <FaShoppingCart style={{ marginRight: '5px' }} />{' '}
                {!isSidebarCollapsed && ' Shopping List'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/family-management">
                <FaUsers style={{ marginRight: '5px' }} />{' '}
                {!isSidebarCollapsed && ' Manage Family'}
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex-grow-1 d-flex flex-column">
        {!shouldHideNavBar && (
          <nav className="header-navbar navbar navbar-expand-lg navbar-dark bg-success border-bottom border-dark">
            <div className="container-fluid justify-content-between">
              <ul className="navbar-nav ms-auto d-flex align-items-center icons-container gap-2">
                <li className="nav-item position-relative">
                  <button
                    className="nav-link btn text-light"
                    onClick={handleInboxClick}
                    style={{ position: 'relative' }}
                  >
                    <FaEnvelope size={24} />
                    {invites.length > 0 && (
                      <span className="notification-dot"></span>
                    )}
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/"
                    id="userMenu"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser size={24} />
                  </Link>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenu"
                  >
                    {user ? (
                      <>
                        <li className="dropdown-item">
                          {`${user.firstName} ${user.lastName}`}
                        </li>
                        <li>
                          <button
                            className="dropdown-item signout-button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                          >
                            {signingOut ? 'Signing Out...' : 'Sign Out'}
                          </button>
                        </li>
                        {error && (
                          <li className="dropdown-item text-danger">
                            Error signing out: {error.message}
                          </li>
                        )}
                      </>
                    ) : null}
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        )}
        <main
          className={''}
          style={{ marginLeft: isSidebarCollapsed ? '80px' : '180px' }}
        >
          {isInviteMenuOpen && invites.length > 0 && (
            <div
              className="invites-dropdown position-absolute bg-white border border-secondary rounded-2 p-2"
              style={{ right: '0', top: '50px', zIndex: '100', width: '300px' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Invitations</strong>
                <button
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setIsInviteMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <ul className="list-group">
                {invites.map((invite) => (
                  <li key={invite.id} className="list-group-item">
                    <div>
                      <strong>{invite.sentByUserFullName}</strong> invited you
                      to join the family: {invite.familyName}
                    </div>
                    <div>Status: {invite.status}</div>
                    {invite.expiresOn && (
                      <div>
                        Expires on:{' '}
                        {new Date(invite.expiresOn).toLocaleDateString()}
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleInviteAction(invite.id, 'accept')}
                        disabled={loadingAction === invite.id}
                      >
                        {loadingAction === invite.id
                          ? 'Accepting...'
                          : 'Accept'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleInviteAction(invite.id, 'decline')}
                        disabled={loadingAction === invite.id}
                      >
                        {loadingAction === invite.id
                          ? 'Declining...'
                          : 'Decline'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {loadingInvites && <p>Loading invites...</p>}

          <Outlet />
        </main>
      </div>
    </div>
  );
};
