terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=main"
}

include {
  path = find_in_parent_folders()
}
