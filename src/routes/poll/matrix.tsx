import { FunctionComponent } from "react";
import { CondorcetResult } from "../../alg/condorcet";
import { Election } from "../../models";

const abreve = (name: string) => name.split(' ')
    .map((part) => part.length > 0 ? part[0].toUpperCase() : '')
    .join('');

export const CondorcetMatrix: FunctionComponent<{ candidates: Election["candidateList"], matrix: CondorcetResult["matrix"] }> = ({
    matrix,
    candidates
}) => {

    return (
        <div className="overflow-auto w-fill">
            <table className="overflow-auto max-w-full format text-sm text-center">
                <thead className="text-xs">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            filler
                        </th>
                        {candidates.map((c) => <th scope="col" className="px-6 py-3">{abreve(c.name)}</th>)}
                    </tr>
                </thead>
                <tbody>
                {
                    matrix.map((row, i) => (
                        <tr>
                            <th scope="row">{abreve(candidates[i].name)}</th>
                            {row.map((res) => <td>{res === undefined ? "-" : res}</td>)}
                        </tr>
                    ))
                        
                }
                </tbody>
                
            </table>
        </div>
    )
    


    // return (
    //     <table
    //         className="w-full"
    //     >
    //         <thead>
    //             {header}
    //         </thead>
    //         <tbody>
    //             {
    //                 matrix.map((row, i) => (
    //                     <tr className="flex">
    //                         <th className="border-1">
    //                             {candidates[i].name}
    //                         </th>
    //                         {row.map((res) => (
    //                             <td
    //                                 className="border-1"
    //                             >
    //                                 {res === undefined ? '-' : res}
    //                             </td>
    //                         ))}
    //                     </tr>
    //                 ))
    //             }
    //         </tbody>
    //     </table>
    // );
}
