from typing import List, Union
from fastapi import Depends, HTTPException, status
from backend.api.auth import get_current_user
from backend.models.user import User

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        user_roles = [r.name for r in current_user.roles]
        
        # SUPER_ADMIN bypasses all role checks
        if "SUPER_ADMIN" in user_roles:
            return current_user
            
        for role in self.allowed_roles:
            if role in user_roles:
                return current_user
                
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation not permitted. Required role: {', '.join(self.allowed_roles)}"
        )

def require_role(roles: Union[str, List[str]]):
    if isinstance(roles, str):
        roles = [roles]
    return Depends(RoleChecker(roles))
