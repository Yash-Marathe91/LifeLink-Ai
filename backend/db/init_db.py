from backend.db.session import engine, Base, SessionLocal
from backend.models.user import User
from backend.models.role import Role, Permission
from backend.models.agency import Agency
from backend.models.api_key import APIKey

def init_db():
    # Create all schema tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Seed default roles if empty
        existing_roles = db.query(Role).count()
        if existing_roles == 0:
            roles_data = [
                ("CITIZEN", "Public user with emergency SOS capabilities"),
                ("FIELD_RESPONDER", "Active rescue squad officer in field"),
                ("DISPATCHER", "Emergency operational command dispatcher"),
                ("AGENCY_ADMIN", "Organization administrator managing team & API keys"),
                ("SUPER_ADMIN", "Global system administrator with root privileges"),
            ]
            for name, desc in roles_data:
                role = Role(name=name, description=desc)
                db.add(role)
            db.commit()
            print("Successfully seeded default RBAC roles!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
