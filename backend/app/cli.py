"""Admin account management.

    python -m app.cli create-admin --email you@company.com [--name "Your Name"]

Prompts for the password (or reads ADMIN_PASSWORD). Running it again for an
existing email resets that admin's password and signs out their sessions.
"""

import argparse
import getpass
import os
import sys

from app.db.session import SessionLocal
from app.schemas.admin import PASSWORD_MAX, PASSWORD_MIN
from app.services import admin_service


def _read_password() -> str:
    password = os.environ.get("ADMIN_PASSWORD")
    if password:
        return password
    password = getpass.getpass("Password: ")
    if password != getpass.getpass("Repeat password: "):
        sys.exit("Passwords do not match.")
    return password


def create_admin(args: argparse.Namespace) -> None:
    password = _read_password()
    if not PASSWORD_MIN <= len(password) <= PASSWORD_MAX:
        sys.exit(f"Password must be {PASSWORD_MIN}-{PASSWORD_MAX} characters.")
    with SessionLocal() as db:
        admin, created = admin_service.create_or_reset_admin(db, args.email, password, args.name)
    print(f"{'Created' if created else 'Updated'} admin {admin.email} (id {admin.id}).")


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    commands = parser.add_subparsers(dest="command", required=True)
    create = commands.add_parser("create-admin", help="create an admin, or reset an existing admin's password")
    create.add_argument("--email", required=True)
    create.add_argument("--name", default="")
    create.set_defaults(func=create_admin)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
