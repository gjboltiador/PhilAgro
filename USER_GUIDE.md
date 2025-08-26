## PhilAgro Web App – User Guide and RBAC Documentation

### What this guide covers
- **RBAC**: roles, permissions, and what each role sees in the UI
- **Planter membership rules** and association logic
- **Ownership and multi‑role** scenarios
- **Navigation map** by module and common tasks

---

## Modules and Navigation Map

- **Dashboard**: `/dashboard`
- **Registration**:
  - **Planters**: `/registration/planters`
  - **Farms**: `/registration/farms`
- **Equipment**:
  - **Tractors**: `/equipment/tractors`
  - **Trucks**: `/equipment/trucks`
  - **Truck Booking**: `/equipment/trucks/booking`
  - **Booking Calendar**: `/equipment/trucks/booking/calendar`
  - **Equipment Calendar**: `/equipment/calendar`
- **Assistance**:
  - **Fertilizer Catalog**: `/assistance/fertilizer`
  - **Financial (planned)**: `/assistance/financial`
- **Prices**:
  - **Overview**: `/prices`
  - **Sugar Prices**: `/prices/sugar-prices`
- **Reports**:
  - **Planters**: `/reports/planters`
- **Profile**: `/profile`
- **Settings**: `/settings`
- **News**: `/news`
- **Auth**: `/auth/login`

---

## Role‑Based Access Control (RBAC)

RBAC determines which tabs/menus a user sees and what actions they can perform. A user can hold multiple roles; permissions are the union of all assigned roles.

### Roles (overview)
- **Planter**
- **Service Provider**
- **Hauler**
- **Farm Equipment Operator**
- **Tractor Operator**
- **Driver**
- **Supplier/Seller** (Fertilizers, Herbicides, Chemicals, and other farm supplies)
- **Crop Inspector**
- **Accounting**
- **Treasury**
- **Approver**
- **Admin**

### Permissions by role (modules and actions)

- **Planter**
  - Dashboard, News, Profile
  - Registration (self): view/update own profile; register farms
  - Equipment: request truck bookings; view booking calendar for own jobs
  - Assistance: browse fertilizer catalog; request assistance/orders
  - Prices: view market and sugar prices
  - Reports: view own delivery/booking history

- **Service Provider**
  - Dashboard, News, Profile
  - Equipment: manage service offerings and assigned work; view calendars
  - Assistance (if also Supplier): manage listings, prices, inventory
  - Reports: service fulfillment/performance
  - Registration: manage own organization profile

- **Hauler**
  - Dashboard, News, Profile
  - Trucks and Booking: manage trucks, drivers, routes; accept/reject booking requests; view booking calendar
  - Reports: trip logs, utilization, delivery summaries

- **Farm Equipment Operator**
  - Dashboard, Profile
  - Equipment: view assigned tasks and schedules; update job status
  - Calendar: daily/weekly schedule view

- **Tractor Operator**
  - Dashboard, Profile
  - Tractors/Calendar: view assigned tractor jobs; update status

- **Driver**
  - Dashboard, Profile
  - Trucks/Calendar: view assigned trips; update status (en‑route, delivered)

- **Supplier/Seller** (Fertilizers/Herbicides/Chemicals/Other Supplies)
  - Dashboard, News, Profile
  - Assistance → Fertilizer Catalog: manage catalog, pricing, stock, offers
  - Orders/Requests: receive and process planter/association requests
  - Reports: sales and inventory

- **Crop Inspector**
  - Dashboard, Profile
  - Registration data (read): planter/farm verification context
  - Reports: inspection findings, compliance status
  - Calendar: inspection scheduling

- **Accounting**
  - Dashboard, Profile
  - Financial (planned): billing, AR/AP, invoicing, statement reconciliation
  - Reports: financial summaries, ledger exports
  - Prices (read): reference for valuation if needed

- **Treasury**
  - Dashboard, Profile
  - Financial (planned): disbursements, cash management
  - Reports: payment status and cash flow snapshots

- **Approver**
  - Dashboard (approvals widget/queues)
  - Approvals in context:
    - Registration (planter/association) approvals
    - Equipment booking approvals
    - Assistance/orders approvals
    - Financial approvals (planned)
  - Reports (read): for due diligence

- **Admin**
  - Everything above + Settings and Administration
  - User & Role Management, Associations, Assets (trucks/tractors/equipment), System configuration
  - Audit logs and global reports

### Quick Navigation Matrix

| Role | Dashboard | Registration | Equipment | Assistance (Fertilizer) | Prices | Financial | Reports | Profile | Settings/Admin |
|---|---|---|---|---|---|---|---|---|---|
| Planter | ✓ | Self | Request/Calendar | Browse/Request | ✓ | – | Own | ✓ | – |
| Service Provider | ✓ | Org | Manage/Calendar | If Supplier | – | – | ✓ | ✓ | – |
| Hauler | ✓ | Org | Trucks/Booking/Cal | – | – | – | ✓ | ✓ | – |
| Farm Equipment Operator | ✓ | – | Assigned/Cal | – | – | – | – | ✓ | – |
| Tractor Operator | ✓ | – | Tractors/Cal | – | – | – | – | ✓ | – |
| Driver | ✓ | – | Trips/Cal | – | – | – | – | ✓ | – |
| Supplier/Seller | ✓ | Org | – | Manage Catalog | – | – | ✓ | ✓ | – |
| Crop Inspector | ✓ | Read | – | – | – | – | ✓ | ✓ | – |
| Accounting | ✓ | – | – | – | Read | Manage | ✓ | ✓ | – |
| Treasury | ✓ | – | – | – | – | Manage | ✓ | ✓ | – |
| Approver | ✓ | Approve | Approve | Approve | – | Approve | Read | ✓ | – |
| Admin | ✓ | All | All | All | All | All | All | ✓ | ✓ |

Notes:
- “Self/Org” indicates self or own organization scope.
- “Approve/Manage/Read” denote action scopes; UI may show approval badges/queues inside related modules.

---

## Associations, Membership, and Deliveries

### Planter membership types
- **Association Member**: registered under a specific association for the crop year.
- **Unaffiliated**: not a member of any association.

### Membership rule (crop year exclusivity)
- A planter may register with an association only if there are no deliveries recorded to other associations within the same crop year.
- If a planter has deliveries to Association A in crop year Y, they cannot join Association B until the next crop year.

### How the app enforces this
- On association registration or change:
  - The system checks delivery records for the current crop year.
  - If deliveries exist to a different association, registration is blocked with a clear message.
- On delivery logging:
  - The delivery record is tied to both the planter and the association.
  - The first delivery in a crop year implicitly “locks” the association for that year unless already registered.

### Typical workflows
- **New planter joins an association**:
  1. Go to `Registration → Planters` and complete profile.
  2. Select association; system validates no conflicting deliveries in current crop year.
  3. Submit; pending approval if configured. Approver/Admin finalizes.
- **Switching associations**:
  - Allowed only if no deliveries in the current crop year or for the next crop year.
- **Unaffiliated planter**:
  - May remain unaffiliated; can still request services, bookings, and supplies subject to provider rules.

---

## Ownership and Multi‑Role Scenarios

- **Associations can own assets and act as suppliers**:
  - Trucks, tractors, and farm equipment can be owned by associations.
  - Associations can list fertilizer/supplies and offer other assistance.
- **Planters can also act as suppliers and/or haulers**:
  - Assign additional roles (e.g., Supplier, Hauler) to the same user account.
  - The UI will expose corresponding modules (catalog management, trucks/booking).
- **Multi‑role behavior**:
  - Users see the union of menus from all assigned roles.
  - Actions are scoped to ownership (e.g., only manage assets you/your org own).
  - Approvals follow configured approval chains even for multi‑role users.

---

## Data Model (implementation guide)

- **Users**: id, name, contact, status
- **Roles**: id, name (Planter, Hauler, Supplier, etc.), description
- **Permissions**: id, key (e.g., `equipment.booking.create`), description
- **RolePermissions**: role_id ↔ permission_id
- **UserRoles**: user_id ↔ role_id
- **Associations**: id, name, contact, type (coop/association), ownership scope
- **Planters**: user_id, association_id (nullable), membership_status (member/unaffiliated), crop_year_active
- **Farms**: id, planter_id, location, area, crop details
- **Assets**:
  - Trucks: id, association_id or owner_user_id
  - Tractors: id, association_id or owner_user_id
  - Equipment: id, type, association_id or owner_user_id
- **Bookings**: id, requester_id (planter/association), asset_type, asset_id (nullable until assigned), schedule, status, approver_id
- **Deliveries**: id, planter_id, association_id, date, crop_year, quantity, destination
- **Assistance**:
  - CatalogItems: id, supplier_id (user or association), category (fertilizer/herbicide/etc.), price, stock
  - AssistanceRequests/Orders: requester_id, supplier_id, items, status, approver_id
- **Financial (planned)**:
  - Invoices, Payments, Disbursements, Ledger entries
- **AuditLogs**: actor_user_id, action, entity, before/after, timestamp

Key constraints:
- Unique constraint: `(planter_id, crop_year)` → association_id must remain consistent with the first delivery for that year.
- Ownership polymorphism on assets: either `association_id` or `owner_user_id` required.

---

## Common Tasks by Role

- **Planter**
  - Register/update profile: `Registration → Planters`
  - Add farms: `Registration → Farms`
  - Book a truck: `Equipment → Trucks → Booking`
  - Track bookings: `Equipment → Booking Calendar`
  - Request supplies: `Assistance → Fertilizer`
  - Check prices: `Prices → Sugar Prices`
  - View history: `Reports → Planters`

- **Hauler**
  - Manage fleet: `Equipment → Trucks`
  - Review and accept bookings: `Equipment → Trucks → Booking`
  - Schedule and dispatch: `Equipment → Booking Calendar`

- **Supplier**
  - Manage catalog: `Assistance → Fertilizer`
  - Process orders: Assistance requests/orders within the module

- **Approver**
  - Review pending approvals: `Dashboard` and inside each module (Registration, Equipment, Assistance, Financial)

- **Accounting/Treasury (planned)**
  - Handle invoices/payments/disbursements: `Assistance → Financial`

- **Operators/Drivers**
  - Check assignments/schedules: `Equipment → Calendar` (or relevant sub‑calendars)
  - Update job/trip status from the assignment view

- **Admin**
  - Manage users/roles, associations, assets, and configuration: `Settings`

---

## Notes and Best Practices

- **Multi‑role users**: assign all relevant roles; the app merges their permissions.
- **Approvals**: keep approval chains lean (usually 1–2 steps) to avoid delays.
- **Crop year integrity**: log deliveries promptly to preserve membership rules.
- **Ownership**: record whether assets belong to an association or an individual owner to ensure correct scoping.
- **Audits**: use audit logs for sensitive actions (approvals, financials, membership changes).

---

## Glossary

- **Crop Year**: The accounting/operational period for deliveries and membership rules.
- **Association**: An organization (e.g., cooperative) that planters can join; may own assets and supply inputs.
- **Assistance**: Programs/services such as supply of fertilizers and other farm inputs, or operational support.
- **Booking**: Request and scheduling of trucks/tractors/equipment for hauling and farm operations.


