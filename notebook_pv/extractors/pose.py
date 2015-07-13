class PoseModelExtractor(object):
    def __init__(self, ignore_hydrogen = True):
        self.ignore_hydrogen = ignore_hydrogen

    def extract_residue_model(self, residue):
        atoms = []
        num_atoms = residue.nheavyatoms() if self.ignore_hydrogen else residue.natoms()

        for i in range(1, num_atoms + 1):
            atoms.append({
                    "name" : residue.atom_name(i).strip(),
                    "element" : residue.atom_type(i).element(),
                    "pos" : tuple(residue.xyz(i))
                })

        return {
            "name" : residue.name3(),
            "num" : residue.seqpos(),
            "atom" : atoms,
        }

    def extract_pose_model(self, pose):
        chains = []

        for i in range(1, pose.conformation().num_chains() + 1):
            residues = [ self.extract_residue_model( pose.residue(r) )
                            for r in range(pose.conformation().chain_begin(i), pose.conformation().chain_end(i) + 1)]
            chains.append( {
                    "name" : str(i),
                    "residue" : residues } )

        return { "chain" : chains }

    def extract_model(self, target):
        self.extract_pose_model( target )
