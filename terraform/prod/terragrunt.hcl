terraform {
  source = "git::https://github.com/bcgov/parks_reso-admin-terraform.git//?ref=v0.0.0"
}

include {
  path = find_in_parent_folders()
}
